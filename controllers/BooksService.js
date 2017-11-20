'use strict';

const db = require('./db');

exports.booksBookIdCheckinPOST = function (session, args, res, next) {
  /**
   * check-ins a book for the user
   * 
   *
   * bookId String ID of the book that needs to be checked-in
   * no response value expected for this operation
   **/
  const book_id = args.bookId.value;
  const user_id = session['user_id'];
  return db.tx(t =>
    t
    .many(
      'SELECT * from user_book_mapping where user_id=$1 and book_id=$2 and is_active=$3 order by ts', [user_id, book_id, true]
    )
    .catch(err => {
      throw new Error("Seems that the user hasn't checkedout out this book");
    })
    .then(userBookMappings => {
      const earliestCheckout = userBookMappings[0];
      return earliestCheckout;
    })
    .then(earliestCheckout => {
      const q1 = t.none(
        'UPDATE user_book_mapping set is_active=false, status_change_ts=$1 where id=$2', [new Date(), earliestCheckout.id]
      );
      const q2 = t.none(
        'UPDATE books set available_copies = available_copies+1 where id = $1', [book_id]
      );
      return t.batch([q1, q2]);
    })
    .then(() => {
      res.end('Book successfully checked in');
    })
  );
};

function checkoutBook(tx, user_id, book_id) {
  var q1 = tx.none(
    'INSERT INTO user_book_mapping(user_id, book_id, borrowed_copies, ts, is_active) ' +
    ' VALUES($1, $2, $3, $4, $5)', [user_id, book_id, 1, new Date(), true]
  );
  var q2 = tx.none(
    'UPDATE books set available_copies = available_copies-1 where id = $1',
    book_id
  );
  return tx.batch([q1, q2]);
}

exports.booksBookIdCheckoutPOST = function (session, args, res, next) {
  const book_id = args.bookId.value;
  const user_id = session['user_id'];
  console.log('User: %s is checking out book: %s ', user_id, book_id);
  return db.tx(t => {
    return t
      .one(
        'SELECT available_copies from books where id = $1', [book_id],
        c => c.available_copies
      )
      .catch(() => {
        throw new Error('Book not found');
      })
      .then(available_copies => {
        if (available_copies > 0) {
          return checkoutBook(t, user_id, book_id);
        } else {
          // Book unavailable
          return Promise.reject(new Error('No copies of the book available'));
        }
      })
      .then(success => {
        res.end('Book is checked-out sucessfully.');
      });
  });
};

exports.booksBookIdReservePOST = function (session, args, res, next) {
  const book_id = args.bookId.value;
  const user_id = session['user_id'];
  console.log('User: %s is reserves a book: %s ', user_id, book_id);
  return db.tx(t => {
    return t
      .one(
        'SELECT available_copies from books where id = $1', [book_id],
        c => c.available_copies
      )
      .catch(() => {
        throw new Error('Book not found');
      })
      .then(available_copies => {

        var q1 = t.none(
          'INSERT INTO user_book_reserve_mapping(user_id, book_id, ts, is_active) ' +
          ' VALUES($1, $2, $3, $4)', [user_id, book_id, new Date(), true]
        );
        var q2 = t.none(
          'UPDATE books set available_copies = available_copies-1 where id = $1',
          book_id
        );
        return t.batch([q1, q2]).then(() => {
          return available_copies;
        });
      })
      .then(available_copies => {
        res.end((available_copies <= 0) ? "Book is not available currently.You will be notified once the book is available for checkout." :
          "Book is reserved sucessfully. Please come and collect the book from the library within 7 days.");
      });
  });
};

exports.booksBookIdPickUpReservedBookPOST = function (session, args, res, next) {
  /**
   * check-ins a book for the user
   * 
   *
   * bookId String ID of the book that needs to be checked-in
   * no response value expected for this operation
   **/
  const book_id = args.bookId.value;
  const user_id = session['user_id'];
  return db.tx(t =>
    t
    .many(
      'SELECT * from user_book_reserve_mapping where user_id=$1 and book_id=$2 and is_active=$3 order by ts', [user_id, book_id, true]
    )
    .catch(err => {
      throw new Error("Seems that the user hasn't reserved this book");
    })
    .then(userBookReserveMappings => {
      const earliestReserved = userBookReserveMappings[0];
      return earliestReserved
    })
    .then(earliestReserved => {
      const q1 = t.none(
        'UPDATE user_book_reserve_mapping set is_active=false, status_change_ts=$1 where id=$2', [new Date(), earliestReserved.id]
      );
      const q2 = t.none(
        'UPDATE books set available_copies = available_copies+1 where id = $1', [book_id]
      );
      return t.batch([q1, q2]).then(()=>{
        return checkoutBook(t, user_id, book_id);
      });    
    }).then(()=>{
      res.end("Book is successfully picked-up and checked-out.");
    })
  );
};

exports.booksBookIdGET = function (args, res, next) {
  /**
   * Lookup book by id
   * Returns a book's details.
   *
   * bookId String The ID of the book for which details that needs to be fetched.
   * returns Book
   **/
  var book_id = args.bookId.value;
  res.setHeader('Content-Type', 'application/json');
  return db
    .one('SELECT * from books where id = $1', book_id)
    .catch(() => {
      res.statusCode = 404;
      res.end();
    })
    .then(books => {
      res.end(JSON.stringify(books));
    });
};


exports.booksGET = function (args, res, next) {
  /**
   * Lookup book by bookTitle
   * Returns the matching books
   *
   * bookTitle String The title of the book that needs to be fetched.
   * returns BookResults
   **/
  var book_title = args.bookTitle.value;
  console.log(book_title);
  return db
    .any(
      'SELECT * from books where book_title ilike $1',
      '%' + book_title + '%'
    )
    .then(books => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(books));
    });
};
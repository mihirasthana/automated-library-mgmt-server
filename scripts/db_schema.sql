--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.5
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: Articles; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE "Articles" (
    id integer NOT NULL,
    title character varying(255),
    url character varying(255),
    text character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE "Articles" OWNER TO mihir;

--
-- Name: Articles_id_seq; Type: SEQUENCE; Schema: public; Owner: mihir
--

CREATE SEQUENCE "Articles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "Articles_id_seq" OWNER TO mihir;

--
-- Name: Articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mihir
--

ALTER SEQUENCE "Articles_id_seq" OWNED BY "Articles".id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE books (
    id character varying(16) NOT NULL,
    book_title character varying(256) NOT NULL,
    isbn character varying(16),
    total_copies integer,
    available_copies integer,
    image_url character varying(4000),
    author character varying(256),
    category character varying(256)
);


ALTER TABLE books OWNER TO mihir;

--
-- Name: user_book_mapping; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE user_book_mapping (
    id integer NOT NULL,
    user_id integer,
    book_id character varying(16),
    borrowed_copies integer NOT NULL,
    ts timestamp without time zone NOT NULL,
    is_active boolean NOT NULL,
    status_change_ts timestamp without time zone
);


ALTER TABLE user_book_mapping OWNER TO mihir;

--
-- Name: user_book_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: mihir
--

CREATE SEQUENCE user_book_mapping_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_book_mapping_id_seq OWNER TO mihir;

--
-- Name: user_book_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mihir
--

ALTER SEQUENCE user_book_mapping_id_seq OWNED BY user_book_mapping.id;


--
-- Name: user_book_reserve_mapping; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE user_book_reserve_mapping (
    id integer DEFAULT nextval('user_book_mapping_id_seq'::regclass) NOT NULL,
    user_id integer,
    book_id character varying(16),
    ts timestamp without time zone NOT NULL,
    is_active boolean NOT NULL,
    status_change_ts timestamp without time zone
);


ALTER TABLE user_book_reserve_mapping OWNER TO mihir;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE user_sessions (
    id integer NOT NULL,
    user_id integer,
    session_id character varying(100)
);


ALTER TABLE user_sessions OWNER TO mihir;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: mihir
--

CREATE SEQUENCE user_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_sessions_id_seq OWNER TO mihir;

--
-- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mihir
--

ALTER SEQUENCE user_sessions_id_seq OWNED BY user_sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mihir
--

CREATE TABLE users (
    id integer NOT NULL,
    username character varying(127) NOT NULL,
    password character varying(512) NOT NULL,
    name character varying(256) NOT NULL
);


ALTER TABLE users OWNER TO mihir;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mihir
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO mihir;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mihir
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: Articles id; Type: DEFAULT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY "Articles" ALTER COLUMN id SET DEFAULT nextval('"Articles_id_seq"'::regclass);


--
-- Name: user_book_mapping id; Type: DEFAULT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_mapping ALTER COLUMN id SET DEFAULT nextval('user_book_mapping_id_seq'::regclass);


--
-- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_sessions ALTER COLUMN id SET DEFAULT nextval('user_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: Articles Articles_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY "Articles"
    ADD CONSTRAINT "Articles_pkey" PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: user_book_mapping user_book_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_mapping
    ADD CONSTRAINT user_book_mapping_pkey PRIMARY KEY (id);


--
-- Name: user_book_reserve_mapping user_book_reserve_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_reserve_mapping
    ADD CONSTRAINT user_book_reserve_mapping_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_book_mapping_book_id_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_mapping_book_id_idx ON user_book_mapping USING btree (book_id);


--
-- Name: user_book_mapping_is_active_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_mapping_is_active_idx ON user_book_mapping USING btree (is_active);


--
-- Name: user_book_mapping_user_id_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_mapping_user_id_idx ON user_book_mapping USING btree (user_id);


--
-- Name: user_book_reserve_mapping_book_id_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_reserve_mapping_book_id_idx ON user_book_reserve_mapping USING btree (book_id);


--
-- Name: user_book_reserve_mapping_is_active_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_reserve_mapping_is_active_idx ON user_book_reserve_mapping USING btree (is_active);


--
-- Name: user_book_reserve_mapping_user_id_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_book_reserve_mapping_user_id_idx ON user_book_reserve_mapping USING btree (user_id);


--
-- Name: user_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: mihir
--

CREATE INDEX user_sessions_user_id_idx ON user_sessions USING btree (user_id);


--
-- Name: user_book_mapping user_book_mapping_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_mapping
    ADD CONSTRAINT user_book_mapping_book_id_fkey FOREIGN KEY (book_id) REFERENCES books(id);


--
-- Name: user_book_mapping user_book_mapping_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_mapping
    ADD CONSTRAINT user_book_mapping_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: user_book_reserve_mapping user_book_reserve_mapping_books_fk; Type: FK CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_reserve_mapping
    ADD CONSTRAINT user_book_reserve_mapping_books_fk FOREIGN KEY (book_id) REFERENCES books(id);


--
-- Name: user_book_reserve_mapping user_book_reserve_mapping_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_book_reserve_mapping
    ADD CONSTRAINT user_book_reserve_mapping_users_fk FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mihir
--

ALTER TABLE ONLY user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--


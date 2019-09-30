--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: descriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.descriptions (
    id integer NOT NULL,
    pmid integer NOT NULL,
    method_id integer NOT NULL,
    interaction_id integer NOT NULL
);


--
-- Name: descriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.descriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: descriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.descriptions_id_seq OWNED BY public.descriptions.id;


--
-- Name: edges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edges (
    id integer NOT NULL,
    interaction_id integer NOT NULL,
    source_id integer NOT NULL,
    target_id integer NOT NULL
);


--
-- Name: edges_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.edges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: edges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.edges_id_seq OWNED BY public.edges.id;


--
-- Name: interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interactions (
    id integer NOT NULL,
    type character(2) NOT NULL,
    protein1_id integer NOT NULL,
    protein2_id integer NOT NULL,
    nb_publications integer NOT NULL,
    nb_methods integer NOT NULL,
    CONSTRAINT interactions_type_check CHECK (((type)::text = ANY (ARRAY[('hh'::character varying)::text, ('vh'::character varying)::text])))
);


--
-- Name: interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.interactions_id_seq OWNED BY public.interactions.id;


--
-- Name: mappings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mappings (
    id integer NOT NULL,
    edge_id integer NOT NULL,
    sequence_id integer NOT NULL,
    description_id integer NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL,
    identity numeric NOT NULL,
    sequence text NOT NULL
);


--
-- Name: mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mappings_id_seq OWNED BY public.mappings.id;


--
-- Name: methods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.methods (
    id integer NOT NULL,
    psimi_id character varying(7) NOT NULL,
    name character varying NOT NULL
);


--
-- Name: methods_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.methods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.methods_id_seq OWNED BY public.methods.id;


--
-- Name: proteins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.proteins (
    id integer NOT NULL,
    type character(1) NOT NULL,
    ncbi_taxon_id integer NOT NULL,
    accession character varying(10) NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    CONSTRAINT proteins_type_check CHECK (((type)::text = ANY (ARRAY[('h'::character varying)::text, ('v'::character varying)::text])))
);


--
-- Name: proteins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.proteins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: proteins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.proteins_id_seq OWNED BY public.proteins.id;


--
-- Name: publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publications (
    pmid integer NOT NULL,
    title character varying NOT NULL,
    year integer NOT NULL
);


--
-- Name: sequences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sequences (
    id integer NOT NULL,
    protein_id integer NOT NULL,
    accession character varying(10) NOT NULL,
    is_canonical boolean NOT NULL,
    sequence text NOT NULL,
    start integer NOT NULL,
    stop integer NOT NULL
);


--
-- Name: sequences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sequences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sequences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sequences_id_seq OWNED BY public.sequences.id;


--
-- Name: taxon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxon (
    taxon_id integer NOT NULL,
    ncbi_taxon_id integer,
    parent_taxon_id integer,
    node_rank character varying(32),
    genetic_code smallint,
    mito_genetic_code smallint,
    left_value integer,
    right_value integer
);


--
-- Name: taxon_name; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxon_name (
    taxon_id integer NOT NULL,
    name character varying(255) NOT NULL,
    name_class character varying(32) NOT NULL
);


--
-- Name: taxon_search; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taxon_search (
    taxon_id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: descriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.descriptions ALTER COLUMN id SET DEFAULT nextval('public.descriptions_id_seq'::regclass);


--
-- Name: edges id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges ALTER COLUMN id SET DEFAULT nextval('public.edges_id_seq'::regclass);


--
-- Name: interactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interactions ALTER COLUMN id SET DEFAULT nextval('public.interactions_id_seq'::regclass);


--
-- Name: mappings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mappings ALTER COLUMN id SET DEFAULT nextval('public.mappings_id_seq'::regclass);


--
-- Name: methods id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.methods ALTER COLUMN id SET DEFAULT nextval('public.methods_id_seq'::regclass);


--
-- Name: proteins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proteins ALTER COLUMN id SET DEFAULT nextval('public.proteins_id_seq'::regclass);


--
-- Name: sequences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences ALTER COLUMN id SET DEFAULT nextval('public.sequences_id_seq'::regclass);


--
-- Name: descriptions descriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT descriptions_pkey PRIMARY KEY (id);


--
-- Name: edges edges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_pkey PRIMARY KEY (id);


--
-- Name: edges edges_source_id_target_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_source_id_target_id_key UNIQUE (source_id, target_id);


--
-- Name: interactions interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interactions_pkey PRIMARY KEY (id);


--
-- Name: interactions interactions_protein1_id_protein2_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interactions
    ADD CONSTRAINT interactions_protein1_id_protein2_id_key UNIQUE (protein1_id, protein2_id);


--
-- Name: mappings mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mappings
    ADD CONSTRAINT mappings_pkey PRIMARY KEY (id);


--
-- Name: methods methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.methods
    ADD CONSTRAINT methods_pkey PRIMARY KEY (id);


--
-- Name: proteins proteins_accession_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_accession_name_key UNIQUE (accession, name);


--
-- Name: proteins proteins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.proteins
    ADD CONSTRAINT proteins_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (pmid);


--
-- Name: sequences sequences_accession_start_stop_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_accession_start_stop_key UNIQUE (accession, start, stop);


--
-- Name: sequences sequences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sequences
    ADD CONSTRAINT sequences_pkey PRIMARY KEY (id);


--
-- Name: taxon taxon_left_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon
    ADD CONSTRAINT taxon_left_value_key UNIQUE (left_value);


--
-- Name: taxon taxon_ncbi_taxon_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon
    ADD CONSTRAINT taxon_ncbi_taxon_id_key UNIQUE (ncbi_taxon_id);


--
-- Name: taxon taxon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon
    ADD CONSTRAINT taxon_pkey PRIMARY KEY (taxon_id);


--
-- Name: taxon taxon_right_value_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon
    ADD CONSTRAINT taxon_right_value_key UNIQUE (right_value);


--
-- Name: taxon_search taxon_search_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon_search
    ADD CONSTRAINT taxon_search_pkey PRIMARY KEY (taxon_id);


--
-- Name: taxon_name unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon_name
    ADD CONSTRAINT "unique" UNIQUE (taxon_id, name, name_class);


--
-- Name: edges_interaction_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX edges_interaction_id ON public.edges USING btree (interaction_id);


--
-- Name: mappings_description_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mappings_description_id_key ON public.mappings USING btree (description_id);


--
-- Name: mappings_edge_id_keys; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mappings_edge_id_keys ON public.mappings USING btree (edge_id);


--
-- Name: mappings_sequence_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mappings_sequence_id_key ON public.mappings USING btree (sequence_id);


--
-- Name: proteins_taxon_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX proteins_taxon_id_key ON public.proteins USING btree (ncbi_taxon_id);


--
-- Name: sequences_protein_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sequences_protein_id_key ON public.sequences USING btree (protein_id);


--
-- Name: taxon_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX taxon_name_key ON public.taxon_search USING gin (name public.gin_trgm_ops);


--
-- Name: taxon_name taxon_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taxon_name
    ADD CONSTRAINT taxon_id FOREIGN KEY (taxon_id) REFERENCES public.taxon(taxon_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


\c jobly_test

CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text
);


CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    salary money NOT NULL,
    equity numeric NOT NULL CHECK (equity >= 0.00 AND equity <=1.00 ),
    company_handle text NOT NULL REFERENCES companies(handle) ON DELETE CASCADE,
    date_posted timestamp with time zone DEFAULT NOW()
);


CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text,
    is_admin boolean DEFAULT false
)
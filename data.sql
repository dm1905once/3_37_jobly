\c jobly

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


const format = require('pg-format');
const db = require('../connection');

const seed = ({
    organisationsData,
    venuesData,
    categoriesData,
    usersData,
    subcategoriesData,
    eventsData,
    attendeesData,
    faqData,
    questionsData,
    reviewsData,
}) => {
    return db
        .query(`DROP TABLE IF EXISTS attendees CASCADE;`)
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS reviews CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS questions CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS faqs CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS events CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS subcategories CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS categories CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS venues CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS users CASCADE;`);
        })
        .then(() => {
            return db.query(`DROP TABLE IF EXISTS organisations CASCADE;`);
        })
        .then(() => db.query('BEGIN'))
        .then(() => {
            return db.query(`
                CREATE TABLE organisations (
                    organisation_id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    description TEXT,
                    logo_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
                    website VARCHAR
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE venues (
                    venue_id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    address_line1 VARCHAR NOT NULL,
                    address_line2 VARCHAR,
                    city VARCHAR NOT NULL,
                    county VARCHAR(100),
                    postcode VARCHAR(20) NOT NULL,
                    latitude NUMERIC(10, 6),
                    longitude NUMERIC(10, 6)
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE categories (
                    category_id SERIAL PRIMARY KEY,
                    name VARCHAR(100) UNIQUE NOT NULL,
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    description VARCHAR,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE INDEX idx_category_slug ON categories (slug);
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    email VARCHAR UNIQUE NOT NULL,
                    password_hash VARCHAR NOT NULL,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    role VARCHAR(50) NOT NULL DEFAULT 'attendee',
                    organisation_id INT REFERENCES organisations(organisation_id)
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE subcategories (
                    subcategory_id SERIAL PRIMARY KEY,
                    category_id INT NOT NULL REFERENCES categories(category_id),
                    name VARCHAR(100) NOT NULL, UNIQUE (category_id, name),
                    slug VARCHAR(100) UNIQUE NOT NULL,
                    description VARCHAR,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE INDEX idx_subcategory_slug ON subcategories (slug);
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE events (
                    event_id SERIAL PRIMARY KEY,
                    organisation_id INT NOT NULL REFERENCES organisations(organisation_id),
                    title VARCHAR NOT NULL,
                    description TEXT NOT NULL,
                    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
                    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
                    venue_id INT NOT NULL REFERENCES venues(venue_id),
                    category_id INT NOT NULL REFERENCES categories(category_id),
                    subcategory_id INT NOT NULL REFERENCES subcategories(subcategory_id),
                    tags TEXT[],
                    is_recurring BOOLEAN DEFAULT FALSE,
                    recurring_schedule JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(50) NOT NULL DEFAULT 'draft',
                    image_url VARCHAR,
                    access_link VARCHAR,
                    is_online BOOLEAN DEFAULT FALSE,
                    signup_required BOOLEAN DEFAULT TRUE
                );
            `);
        })
        .then(() => {
            return db.query(`
                DROP FUNCTION IF EXISTS update_timestamp CASCADE;
                CREATE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = CURRENT_TIMESTAMP;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
                CREATE TRIGGER events_updated_at
                BEFORE UPDATE ON events
                FOR EACH ROW
                EXECUTE FUNCTION update_timestamp();
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE attendees (
                    registration_id SERIAL PRIMARY KEY,
                    event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
                    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE faqs (
                    faq_id SERIAL PRIMARY KEY,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE questions (
                    question_id SERIAL PRIMARY KEY,
                    question TEXT NOT NULL,
                    answer TEXT,
                    event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
                    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
                );
            `);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE reviews (
                    review_id SERIAL PRIMARY KEY,
                    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                    review_text TEXT,
                    event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
                    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);
        })
        .then(() => {
            const insertOrganisationsQueryStr = format(
                'INSERT INTO organisations (name, description, logo_url, website) VALUES %L;',
                organisationsData.map(
                    ({ name, description, logo_url, website }) => [
                        name,
                        description,
                        logo_url,
                        website,
                    ]
                )
            );
            return db.query(insertOrganisationsQueryStr)
        })
        .then(() => {
            const insertVenuesQueryStr = format(
                'INSERT INTO venues ( name, address_line1, address_line2, city, county, postcode, latitude, longitude) VALUES %L;',
                venuesData.map(
                    ({
                        name,
                        address_line1,
                        address_line2,
                        city,
                        county,
                        postcode,
                        latitude,
                        longitude,
                    }) => [
                        name,
                        address_line1,
                        address_line2,
                        city,
                        county,
                        postcode,
                        latitude,
                        longitude,
                    ]
                )
            );
            return db.query(insertVenuesQueryStr)
        })
        .then(() => {
            const insertCategoriesQueryStr = format(
                'INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES %L;',
                categoriesData.map(
                    ({ name, slug, description, created_at, updated_at }) => [
                        name,
                        slug,
                        description,
                        created_at,
                        updated_at,
                    ]
                )
            );
            return db.query(insertCategoriesQueryStr)
        })
        .then(() => {
            const insertUsersQueryStr = format(
                'INSERT INTO users (email, password_hash, first_name, last_name, role, organisation_id) VALUES %L',

                usersData.map(
                    ({
                        email,
                        password_hash,
                        first_name,
                        last_name,
                        role,
                        organisation_id,
                    }) => [
                        email,
                        password_hash,
                        first_name,
                        last_name,
                        role,
                        organisation_id,
                    ]
                )
            );
            return db.query(insertUsersQueryStr)
        })
        .then(() => {
            const insertSubcategoriesQueryStr = format(
                'INSERT INTO subcategories (category_id, name, slug, description, created_at, updated_at) VALUES %L',
                subcategoriesData.map(
                    ({
                        category_id,
                        name,
                        slug,
                        description,
                        created_at,
                        updated_at,
                    }) => [
                        category_id,
                        name,
                        slug,
                        description,
                        created_at,
                        updated_at,
                    ]
                )
            );
            return db.query(insertSubcategoriesQueryStr)
        })
        .then(() => {
            const insertEventsQueryStr = format(
                'INSERT INTO events (organisation_id, title, description, start_datetime, end_datetime, venue_id, category_id, subcategory_id, tags, is_recurring, recurring_schedule, status, image_url, access_link, is_online) VALUES %L',
                eventsData.map(
                    ({
                        organisation_id,
                        title,
                        description,
                        start_datetime,
                        end_datetime,
                        venue_id,
                        category_id,
                        subcategory_id,
                        tags,
                        is_recurring,
                        recurring_schedule,
                        status,
                        image_url,
                        access_link,
                        is_online,
                    }) => [
                        organisation_id,
                        title,
                        description,
                        start_datetime,
                        end_datetime,
                        venue_id,
                        category_id,
                        subcategory_id,
                        `{${tags.join(',')}}`,
                        is_recurring,
                        recurring_schedule,
                        status,
                        image_url,
                        access_link,
                        is_online,
                    ]
                )
            );
            return db.query(insertEventsQueryStr)
        })
        .then(() => {
            const insertAttendeesQueryStr = format(
                'INSERT INTO attendees (event_id, user_id, created_at) VALUES %L',
                attendeesData.map(({ event_id, user_id, created_at }) => [
                    event_id,
                    user_id,
                    created_at,
                ])
            );
            return db.query(insertAttendeesQueryStr)
        })
        .then(() => {
            const insertFaqsQueryStr = format(
                'INSERT INTO faqs (question, answer, event_id) VALUES %L',
                faqData.map(({ question, answer, event_id }) => [
                    question,
                    answer,
                    event_id,
                ])
            );
            return db.query(insertFaqsQueryStr)
        })
        .then(() => {
            const insertQuestionsQueryStr = format(
                'INSERT INTO questions (question, answer, event_id, user_id) VALUES %L',
                questionsData.map(({ question, answer, event_id, user_id }) => [
                    question,
                    answer,
                    event_id,
                    user_id,
                ])
            );
            return db.query(insertQuestionsQueryStr)
        })
        .then(() => {
            const insertReviewsQueryStr = format(
                'INSERT INTO reviews (rating, review_text, event_id, user_id, created_at) VALUES %L',
                reviewsData.map(
                    ({
                        rating,
                        review_text,
                        event_id,
                        user_id,
                        created_at,
                    }) => [rating, review_text, event_id, user_id, created_at]
                )
            );
            return db.query(insertReviewsQueryStr)
        })
        .then(() => db.query('COMMIT'))
        .catch((err) => {
            return db.query('ROLLBACK').then(() => {
                throw err;
            });
        })
};

module.exports = seed;

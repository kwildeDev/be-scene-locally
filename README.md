# Scene Locally

## Backend API Overview

The `be-scene-locally` API serves as the backend for a community-focused events platform. It provides the necessary endpoints to manage event data, user authentication, and related functionalities, enabling local organisations to promote their events and connect with the community.

**Key Features:**

* **User Authentication:** The API handles user login via a secure authentication system. Users can log in by providing their name and password, which are then verified using bcrypt for password hashing. Upon successful login, the API issues a JSON Web Token (JWT) that can be used to authenticate subsequent requests and access user-specific data (e.g., via the `/api/users/me` endpoint). User registration is not yet available.

* **Event Management:** The API supports full CRUD (Create, Read, Update, Delete) operations on events. This allows for comprehensive management of event data, including creation, retrieval, modification, and deletion.

* **Organisation and Category Management:** The API provides read-only access to organisation, category, and subcategory data. This enables the frontend to display event listings with relevant organisational and categorical information.

* **Attendee Management:** The API manages event sign-ups and cancellations through the creation and deletion of attendee records. This allows users to register for and unregister from events.

* **User Data Retrieval:** The API allows retrieval of user records.

* **Data Validation:** Data integrity is maintained through validation within the SQL queries/commands.

* **Design Considerations:** This API was designed to provide a more community-focused and feature-rich events platform than existing public alternatives. It prioritises:

    * **Enhanced Event Filtering:** The API offers flexible filtering options to cater to diverse event types, including recurring events and events that may not require sign-ups.

    * **Increased User Interaction:** The API is built to support future features such as reviews, FAQs, and Q&A sections, fostering greater interaction between users and event organisers.

    * **Local Organisation Focus:** The API aims to provide local organisations with increased visibility and promotion opportunities.

**Base URL:**

The base URL for the API is: `https://scene-locally.onrender.com/api`

**Future Features:**

The database is currently seeded with tables to support the following features, which are planned for future implementation:

* Frequently Asked Questions (FAQs)

* User Questions and Organizer Answers

* Event Ratings and Reviews

## Backend Local Development Setup

Before you begin, ensure you have the following installed:

* **Node.js:** (A recommended compatible version is v22.14.0). You can download it from [https://nodejs.org/](https://nodejs.org/)
* **npm** or **Yarn:**
    * **npm:** Usually comes bundled with Node.js. Check your version with `npm -v`.
    * **Yarn:** Installation instructions: [https://yarnpkg.com/getting-started](https://yarnpkg.com/getting-started)
* **PostgreSQL:** (Recommended ^8.7.3). You can find installation instructions here: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

Follow these steps to set up your local backend environment:

1.  **Clone the repository:**
    ```
    git clone https://github.com/kwildeDev/be-scene-locally.git
    cd be-scene-locally
    ```

2.  **Install dependencies:**
    ```
    npm install
    # or
    yarn install
    ```

3.  **Database Setup:**
    * **Install PostgreSQL:** If you haven't already, install PostgreSQL on your local machine.
    * **Run database setup script:** Execute the following command to create the necessary databases:
    ```
    npm run setup-dbs
    # or
    yarn run setup-dbs
    ```
    *This command will run the SQL script located at `./db/setup.sql`.*

4.  **Environment Variables:**
    * Create two `.env` file in the root of the project.

    ```
        .env.test
        .env.development
    ```

    In each file enter the line `PGDATABASE=database_name_here`, replacing `database_name_here` with the **test database** for `.env.test`, and with the **development database** for `.env.development`.


5.  **Seed the database:** To fill the local database with initial data enter the command:
    ```
    npm run seed
    # or
    yarn run seed
    ```
    *This command will execute the script at `./db/seeds/run-seed.js`, and will populate the databases with development data which can be found at `db/data/development-data`.*


6.  **Run the backend server:**
    ```
    npm start
    # or
    yarn start
    ```
    *This will start the backend server using `node ./src/listen.js`.*

7. **Testing:**

    To run the automated Jest tests for the backend part of this project enter the command `npm test`.

    The test files use dedicated test data which is recreated every time the tests are run. This data can be found at `db/data/test-data`

    Backend unit tests can be found in the `__tests__` directory in these files:

    ```
    app.test.js
    api-structure.test.js
    categories.test.js
    events.test.js
    organisations.test.js
    seeding.test.js
    users.test.js
    venues.test.js
    ```


### Optional Development Tools

* For automatic server restarts during development, you can install and use Nodemon:
    ```bash
    npm install -g nodemon
    # or
    yarn global add nodemon
    ```
    Then, you can run the server with:
    ```bash
    nodemon ./src/listen.js
    ```

## Deployment

This project has been deployed with [Supabase](https://supabase.com/) and [Render](https://render.com/).


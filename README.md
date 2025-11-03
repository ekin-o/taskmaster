# Taskmaster

Simple to-do app MVP

## Tech & Requirements

 * .NET Core 8 LTS (& dotnet tooling)
 * Node.js v22 LTS (& npm)
 * React frontend
 * SQLite database
 * Frontend code in `app/`
 * Backend code in `api/`

## How to run

#### Frontend
* Config file located at `app\config.json`
    * After starting the backend service (below), double check `apiUrl` value to have same base url as the one reported by dotnet process 
* Using command line
``` 
cd app
npm install
npm run build
npm run preview
```
* Take note of the url reported by vite, might be required below during backend config
* Navigate to this url in your browser after running the backend

#### Backend
* Config file located at `api\Taskmaster.Api\appsettings.json`
    * update `AppUrl` value if different
    * specify `DatabasePath` if desired, otherwise it will default to `%USERPROFILE%\AppData\Local\TaskmasterDB.db` 
* Database creation:
    * `api\Taskmaster.Database\Utils.cs`
    * Api service will automatically create the database and the tables required.
    * Can force re-create an existing database by passing `createDatabase = true` to `Utils.CreateTables`
    * It will also insert 3 test users into database (Users table). At the moment this is the only option to create users. 
        * Either modify existing inserts, or add new ones at the end of the command in `Utils.CreateTables`. 
        * Need to create corresponding entries in `Authentication` table.
    * `Utils.PopulateTestingData` populates the database with some basic data for `userone@email.com`. Can enable the commented out call in `api\Taskmaster.Api\Program.cs` to do this.
        * Can modify the command in `Utils.PopulateTestingData` to add/change the data.
* Using Visual Studio:
    * Open `api\TaskmasterApi.sln`
    * Build solution (ensure Nuget packages are installed)
    * Run `https` profile (ensure Taskmaster.Api project is set as startup project)
* Using command line:
    ```
    cd api\Taskmaster.Database
    dotnet build
    cd ..\Taskmaster.Api
    dotnet build
    dotnet run --launch-profile https
    ```

#### Users
| Name | Email | Passwor |
|----------|----------|----------|
| User One | userone@email.com | pwdone |
| User Two | usertwo@email.com | pwdtwo |
| User Three | userthree@email.com | pwdtre |


## App basics
* There are 2 base components in the app/api. Lists (TaskLists) and Tasks (TaskItems). 
    * TaskList and TaskItem were chosen to avoid conflict with some common classes in .NET.
* Every task belongs to a list.
* Every list belongs to a user.
* Users can create multiple lists and tasks. Different lists and tasks can have same name. 
* Users can only perform operations on the lists they own.
* Lists and tasks can be deleted.
* Lists and tasks can be starred to mark priority over other items.
* Completed tasks still appear on the page but are pushed to bottom, and can be marked undone.

## Notes, thoughts, and explanations
* `@vitejs/plugin-basic-ssl` is only for demo purposes. It occasionally prompts unsafe page in browsers (especially running via `npm run dev`). Ideally self-signed certificates are used, and right vite config is implemented for https
* I took this opportunity to learn and try out `RTK Query` (`@reduxjs/toolkit`). I have experience with `react-redux` but `RTKQuery` is a new framework I was curious to try out.
* I used npm as package manager to keep the app requirements minimal.
* I haven't used any AI agents/assistance while working on this app. As this is part of an interview process, I wanted to showcase my abilities and thinking without any assistance. 
* I made the following prioritization: 
    * Auth/multiple users: Any modern web-app supports multiple users, and having auth will help users access to synced data from any device they use the app with.
    * Api over app: Having strong backend (and data model) is more important. It could support multiple clients.
    * Functional UI and intuitive UX over more polished UI
* I made the following assumptions: 
    * This app is intended for a single user to manage their own tasks. 
    * Therefore a user will only perform operations on the lists (hence the tasks) they own
        * Multiple ownership can be supported with a Mapping table instead of the OwnerId column in List table. 
    * This app was designed as desktop (browser) first
* Thoughts on design and scalability
    * I tried to keep the Api as flexible as possible. Some requirements can be dictated by the business, but otherwise being flexible helps the app scale, and change quickly. Actions on lists and tasks(star, mark done, and future work: edit name, add/remove due date etc. ) happen in a single call/endpoint
    * On the frontend, I wanted Lists and Tasks to share a base component, especially considering the roadmap (edit name, drag and drop sorting/nesting). It will be easier to implement features in both consistently. But, if these components diverge too much they can be split up.
    * Implementing backend sorting and filtering in the future will help with app performance as data gets larger.
    * Lists and tasks can be capped to N if storage requirements dictate.
    * Api can be containerized, and deployed in kubernetes cluster 
    * Having assumption of every list has one owner, and only owner can modify lists and tasks, helps with db fetch when Lists and Users grow.
        * Lists owned by the user can be stored as a Claim, and user can be denied access at auth level instead of controller action.

## Future features
* Phase 1
    * Fix glitch during login
    * Editing tasks and lists
    * Deadline/due date on tasks
    * Register screen and ability to add new users
    * Stack based configs (instead of one config file)
    * Improved UI/UX
        * Fix the white spaces, search bar width, and improve panel titles
        * Introduce app theme
        * Test and ensure responsiveness
    * Snackbar messages/alerts on unsuccessful operations, and successful ones where desired
* Phase 2 
    * View and recover deleted items
    * Scheduled task to clean up deleted items if deleted for more than N days
    * Move away from Salted hash authentication to Cloud/Identity provider
    * Use JWT token authentication instead of Cookie auth
    * Introduce sorting of lists and tasks
    * Api sorting (and search)
    * Set reminder dates in tasks
* Phase 3
    * Drag and drop ordering of items
    * Sub-lists and sub-tasks (drag and drop nesting)
    * Tags & search by tags
        * Can introduce a side panel for details if rendered row item gets too busy
    * Export/import lists and tasks
    * Dark/light modes
    * Ability to edit user profile
    * (Tech Task) - better typing in frontend code
    * (Tech task) - Frontend and Backend tests
* Beyond
    * Integration with other apps
    * Shared lists 
        * Co-working/editing
        * Assigning users to tasks
        * Admin mode for list owners
    * Improved search (using search index)

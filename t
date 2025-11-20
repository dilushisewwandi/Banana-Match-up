* [33mfbbac02[m[33m ([m[1;31morigin/backend[m[33m, [m[1;32mbackend[m[33m)[m feat: Add level route
* [33m9939dbd[m feat: add level controller and route for saving beginner level scores
[31m|[m * [33mfd30680[m[33m ([m[1;31morigin/game-ui[m[33m, [m[1;32mgame-ui[m[33m)[m feat: Add BeginnerLevel game component with scoring and level completion logic
[31m|[m [32m|[m * [33m142a559[m[33m ([m[1;36mHEAD -> [m[1;32mtest[m[33m, [m[1;31morigin/test[m[33m)[m chore: update backend DB config and install frontend dependencies
[31m|[m [32m|[m *   [33mee85b9f[m Merge pull request #5 from dilushisewwandi/game-ui
[31m|[m [32m|[m [34m|[m[32m\[m  
[31m|[m [32m|[m [34m|[m[32m/[m  
[31m|[m [32m|[m[32m/[m[34m|[m   
[31m|[m * [34m|[m [33mc0ab6eb[m feat(dashboard): update UI to display player scores dynamically from backend
[31m|[m [35m|[m *   [33m49968a5[m Merge pull request #4 from dilushisewwandi/backend
[31m|[m [35m|[m [36m|[m[31m\[m  
[31m|[m [35m|[m[31m_[m[36m|[m[31m/[m  
[31m|[m[31m/[m[35m|[m [36m|[m   
* [35m|[m [36m|[m [33m96b72be[m feat(controller): update dashboardController to fetch total players and scores from DB
* [35m|[m [36m|[m [33me10d586[m feat(models): update Score model to include level column for player scores
[1;31m|[m [35m|[m *   [33m1f53791[m Merge pull request #3 from dilushisewwandi/backend
[1;31m|[m [35m|[m [1;32m|[m[1;31m\[m  
[1;31m|[m [35m|[m[1;31m_[m[1;32m|[m[1;31m/[m  
[1;31m|[m[1;31m/[m[35m|[m [1;32m|[m   
* [35m|[m [1;32m|[m [33mf5b54a4[m Add dashboard controller
* [35m|[m [1;32m|[m [33m0cfba20[m Add dashboard controller, route, and update server.js to include dashboard endpoint
* [35m|[m [1;32m|[m [33m668b1e5[m feat(models): add Score model and Player–Score associations
[1;33m|[m [35m|[m *   [33mff46a77[m Merge pull request #2 from dilushisewwandi/game-ui
[1;33m|[m [35m|[m [1;34m|[m[35m\[m  
[1;33m|[m [35m|[m [1;34m|[m[35m/[m  
[1;33m|[m [35m|[m[35m/[m[1;34m|[m   
[1;33m|[m * [1;34m|[m [33m606b71c[m feat(client): display logged-in user's name on Welcome Page
[1;33m|[m [1;35m|[m *   [33m5f9b048[m Merge pull request #1 from dilushisewwandi/backend
[1;33m|[m [1;35m|[m [1;36m|[m[1;33m\[m  
[1;33m|[m [1;35m|[m[1;33m_[m[1;36m|[m[1;33m/[m  
[1;33m|[m[1;33m/[m[1;35m|[m [1;36m|[m   
* [1;35m|[m [1;36m|[m [33mcea029d[m feat(server): register user routes and integrate protected user endpoint
* [1;35m|[m [1;36m|[m [33mce60ccf[m feat(user): add getUser controller and route with JWT verification
[31m|[m [1;35m|[m * [33m0e24b9c[m chore: update package-lock.json after merging game-ui
[31m|[m [1;35m|[m * [33m4baad56[m chore: update package-lock.json after merging game-ui
[31m|[m [1;35m|[m * [33m9a3f17e[m Merge branch 'game-ui' into test
[31m|[m [1;35m|[m[31m/[m[1;35m|[m 
[31m|[m[31m/[m[1;35m|[m[1;35m/[m  
[31m|[m * [33me1eff1f[m feat(client): improve login flow to show toast before navigation
[31m|[m * [33m3c5d823[m feat(client): update Dashboard with floating bananas, score summary, and interactive navigation
[31m|[m * [33m0e2cec1[m feat(client): update pages and SignupForm with motion, navigation, and styles
[31m|[m * [33m86cde91[m Update LoadingPage and WelcomePage UI
[31m|[m * [33mdf69936[m Updated Login and Signup form UI with animations
* [33m|[m [33m8fe6224[m fix(auth): import Player model for creating player profile on signup
* [33m|[m [33m8bc5d81[m chore(database): update syncModels to include User and Player model syncing
* [33m|[m [33m825de17[m fix(auth): correct Player creation logic and clean controller
* [33m|[m [33mba4cdc4[m feat(auth): create Player profile automatically after user signup
* [33m|[m [33mf36a11d[m feat(models): add Player model for storing game profile data
* [33m|[m [33m455ac3d[m chore: add syncModels.js to initialize Sequelize tables and update backend setup
* [33m|[m [33m01a1e7b[m feat(backend): update server.js with Sequelize DB connection, auth routes, and error handling
* [33m|[m [33m6007c6c[m Resolve merge conflict: keep auth branch Sequelize authController
* [33m|[m   [33m7cf1d9e[m Resolve merge conflict: keep auth branch Sequelize authController
[34m|[m[35m\[m [33m\[m  
[34m|[m * [33m|[m [33m4398b64[m[33m ([m[1;31morigin/auth[m[33m, [m[1;32mauth[m[33m)[m feat(auth): add JWT auth middleware
[34m|[m * [33m|[m [33m3915da5[m refactor(auth): update auth controller to use Sequelize
[34m|[m * [33m|[m [33m007e7ae[m feat(auth): add User Model
[34m|[m * [33m|[m [33m7d759ef[m Remove old MySQL db.js from auth branch (using backend Sequelize db.js instead)
[34m|[m * [33m|[m [33m4bc0572[m Clean auth branch: remove server and package files
* [35m|[m [33m|[m [33m9c7f0e9[m chore(backend): migrate DB connection to Sequelize and initialize ORM setup
* [35m|[m [33m|[m [33m3c37036[m Initialize backend with authentication and database setup
[33m|[m [35m|[m[33m/[m  
[33m|[m[33m/[m[35m|[m   
[33m|[m [35m|[m *   [33m0812748[m[33m ([m[1;35mrefs/stash[m[33m)[m On auth: backend WIP
[33m|[m [35m|[m [36m|[m[1;31m\[m  
[33m|[m [35m|[m [36m|[m * [33mab28831[m index on auth: 374c4dc feat(client): update UI, pages, and animations
[33m|[m [35m|[m [36m|[m[36m/[m  
[33m|[m [35m|[m * [33m374c4dc[m feat(client): update UI, pages, and animations
[33m|[m [35m|[m * [33m76dacc7[m style(client): update overall UI styles and animations across all pages
[33m|[m [35m|[m[35m/[m  
[33m|[m * [33mf6ca6e1[m Added authentication module with DB connection
[33m|[m[33m/[m  
* [33m235ae5d[m[33m ([m[1;31morigin/master[m[33m, [m[1;32mmaster[m[33m)[m Initial commit: add frontend files, gitignore and README

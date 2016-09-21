# WebApp20
Baja web app 2.0

It is recommended to follow the angular style guide written [here](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md).

## How to install

### Install git

#### On Windows

1. Download it [here](https://git-scm.com/download/win). (RECOMMENDED: Keep 'Git Bash' checked in order to install Git Bash). It is recommended to choose 'Use Git from the Windows Command Prompt'
2. Run `git --version` in either a command prompt or Git Bash in order to verify git is installed.

#### On Ubuntu

1. Run `sudo apt-get install git` in Terminal.
2. Run `git --version` to verify it is installed.

### Clone the repo

1. Open a Terminal, Command Prompt, or Git Bash.
2. `cd` to the location where you want to put the 'WebApp20' folder. (Recommended to use `cd ~/Documents` or `mkdir ~/Documents/GitHub; cd ~/Documents/GitHub`)
3. Run `git clone https://github.com/PhoenixRacing/WebApp20`.

### Install node.js

#### On Windows

1. Download the installer [here](https://nodejs.org/en/download/).
2. Run the installer
3. Open a command prompt.
4. Run `node -v` and `npm -v` in a shell and ensure that some version is printed. (NOTE: shell means Command Prompt, Git Bash, or Terminal).

#### On Ubuntu/Debian systems

1. Run `sudo apt-get install node` and `sudo apt-get install npm`.
4. Run `node -v` and `npm -v` in a shell and ensure that some version is printed. (NOTE: shell means Command Prompt, Git Bash, or Terminal).

### Install MongoDB

#### On Windows

1. Download and run the installer [here](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.2.9-signed.msi). Use the 'Complete' installation.
2. Run `mkdir \data\db`.
3. Run `mongod` to verify that MongoDB is working.

#### On Ubuntu

1. Run `sudo mkdir -p /data/db`.
1. Follow the instructions [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition).
2. Run `mongod` to verify that MongoDB is working. (You might have to do `sudo mongod` if that fails, we don't know why).

### Install packages

#### On Windows:

Recommended: Use Git Bash and follow the instructions for Ubuntu.

Otherwise:

1. Open the 'tools/install.bash' file in the 'WebApp20' directory and copy its contents.
2. Open Command Prompt
3. `cd` into the 'WebApp20' folder.
4. Paste.

#### On Ubuntu

1. Open Terminal and `cd` into the 'WebApp20' directory.
2. Run `bash tools/install.bash`.

### Get auth.js

For security reasons, we do not publish `auth.js` on GitHub. You will have to get the `auth.js` file from a team lead or teammate. You can ask Sawyer or Radmer for a copy of the file.

### Recommended step: Install `nodemon`

`nodemon` automatically restarts the project when it notices any changes to files. This is very convenient. If you don't use nodemon, you'll have to manually restart the project each time you want to

1. Run `npm install -g nodemon` in Terminal, Git Bash, or Command Prompt. (You may need to add a `sudo` in front if using Ubuntu).

## First time setup

1. Run the project as detailed under `Run the project`.
2. Go to `localhost:3000/signup` in the browser, and sign up.
3. Go to the `WebApp20` folder in a shell.
4. Run `mongo`. You should enter a mongo shell.
5. Run `use olinbaja`.
6. Run `db.users.update({}, {"$set":{"admin":true}})`.

## Run the project

1. Open a shell and run `mongod`.
2. Open another shell and `cd` into the 'WebApp20' directory.
3. Run `nodemon app.js`. (Use `node` instead of `nodemon` if you didn't install `nodemon`). (NOTE: On Windows, you may need to do `nodemon ~/path/to/app.js` if it gives you an error).
4. Navigate to `localhost:3000` in your browser.

# Typescript Boilerplate :cherry_blossom:

Basic boilerplate project to run Typescript. Transpile your code and the run it!

## Set enviroment variables

You have to copy the `env.example` template file and name the copy `.env`, add the respective values to the keys and the enviroment
variables will be set the next time you run your app.

## Execute your code

First you must install all the dependencies to run the project
```console
yarn install
```

Then you have to transpile the TS code to a executable version on JS, to do this run this command.
```console
npm run dev
```

This executes the order to transpile the code and sets `watch` flag, so the code that you modifies will be inmediately transpiled!

Now you can execute your transpiled code with the next command.
```console
npm run start
```

Now you're executing the code in the same modality that the previous command, with `watch` so, every time you change the code of your `src` project it will be
transpiled (By the second command) and inmediately executed (By the third one).

### Happy Coding! :smile:

# QUICKPAGE

A modern cli for multi page web application powered by vite.js, which is inspired in the situation where some none-framework (or small framework) web pages are needed. We want to manage them in a high efficient way. We want to create it, develop it one by one. Finally, we want to build them on purpose.

## quickpage-cli

This is the main command line project, which help you manage your tiny and simple web application.

## create-quickpage

The template to create this tiny and simple multi-page web application.

## How to contribute

If you want to develope or contribute this project, you should learn how to develop a command line.

First, `pnpm` is preferred in this workspace.

```bash
pnpm i
```

Second, you should link this project into your local development environment.

```bash
cd packages/quickpage
sudo npm link
```

Then, you can change the code and rebuild the cli.

```bash
pnpm i

#or 

pnpm run prepare --filter quickpage-cli

#or

pnpm run prepare --recursive

```

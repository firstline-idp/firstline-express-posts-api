# Firstline Express Integration Example (Posts Api)

This examples feature a minimal Express application using Firstline as Identity Provider. It is secured using JWTs which are verified by passport using your organisation JWKS.

## How to use

- go to https://admin.firstline.sh and complete the quickstart (you should now have atleast 1 application and 1 api)
- copy sample.env as .env
- replace tenant with your {tenant} which can be found on under your organisation settings
- replace {audience} with the your Api identifier

```bash
npm install
node api.js
```

We recommend using one of our Frontend Examples to interact with the Posts-Api:

- https://github.com/firstline-idp/firstline-react-posts-api
- https://github.com/firstline-idp


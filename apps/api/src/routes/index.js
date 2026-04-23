import * as auth from "./auth/index.js"

export default function (app) { 
    app.register(auth, {prefix : '/auth'})
}
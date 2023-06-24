import express from 'express';
import {graphqlHTTP} from 'express-graphql';

const path = require('path');

const cookieParser = require('cookie-parser')
const cors = require('cors');

import { NON_AUTH_PATHS } from '@common/constants';

import {BlogAppSchema} from './graphql/schema';

const bodyParser = require('body-parser');

const { Client } = require('pg')


// const { exec } = require('child_process');
// exec('pgrep -q postgres', (error, stdout, stderr) => {
// exec('echo "hi"', (error, stdout, stderr) => {
//     console.log(stdout);
//     console.log(stderr);
//     if (error !== null) {
//         console.log(`exec error: ${error}`);
//     }
// });

// const other = () => {


const client = new Client({
    // user: 'unfriend',
    user: 'postgres',
    host: 'localhost',
    // database: 'postgres',
    database: 'financial_analytics',
    password: '',
    port: 5432,
    // "schema": "public",
})
client.connect(function() {
    console.log('pg client connect callback', arguments);
    
});

const app = express();
const port = 3000

const mode = process.env.MODE || 'production';

// const Fingerprint = require('express-fingerprint')

// let jwtAccess = null;


const root = {};

app.use(cookieParser())
app.use(bodyParser())
app.use(function(err, req, res, next) {
    console.log('bbb')
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(errorHandler);

// app.use(Fingerprint({
//     parameters:[
//         // Defaults
//         Fingerprint.useragent,
//         // Fingerprint.acceptHeaders,
//         // Fingerprint.geoip,
//
//         // Additional parameters
//         // function(next) {
//         //     // ...do something...
//         //     next(null,{
//         //         'param1':'value1'
//         //     })
//         // },
//         // function(next) {
//         //     // ...do something...
//         //     next(null,{
//         //         'param2':'value2'
//         //     })
//         // },
//     ]
// }))

app.use(cors());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Headers", ['Authorization']);
//     res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//     res.header("Access-Control-Allow-Credentials", "true");
//     next();
// });

const onLogoutCleanup = res => {
    res.clearCookie('jwtRefresh');
};

const authorizationMiddleware = async (req, res, next) => {
    const userTokens = await getAuthorizedUserTokens(req, res);
    const isUserAuthorized = Boolean(userTokens);
    req.isUserAuthorized = isUserAuthorized;
    console.log('authorizationMiddleware', isUserAuthorized, 'userTokens', userTokens);

    if (isUserAuthorized) {
        const backUrl = req?.body?.backUrl || req?.query?.backUrl || '/';

        res.cookie('jwtRefresh', userTokens.refresh, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 30 days
            httpOnly: true,
        });

        req.jwtAccess = userTokens.access;

        if (req.originalUrl === '/auth/authorize' && backUrl) {
            res.redirect(backUrl);
        } else {
            next();
        }
    } else {
        const { originalUrl } = req;

        if (NON_AUTH_PATHS.includes(req._parsedUrl.pathname)) {
            next();
        } else {
            onLogoutCleanup(res);

            const loginRedirectUrl = `/login${originalUrl ? `?backUrl=${originalUrl}` : ''}`;
            res.redirect(loginRedirectUrl);
        }
    }
};

const getAuthorizedUserTokens = (req, res) => {
    const {username, password} = req.body || req.query || {};

    // TODO: Пока есть редиректы, контекст в реквестах не сохраняется. Погуглить, что в таком случае делать.
    // Самое простое — оставить только рефреш токены.
    const token = req.jwtAccess;

    // const fingerprint = req.fingerprint;
    // console.log('req.fingerprint', JSON.stringify(fingerprint));

    console.log('getAuthorizedUserTokens', req.originalUrl, 'username', username, 'password', password, 'access token', token, 'refresh token', req.cookies.jwtRefresh);

    const jwt = require('jsonwebtoken');
    const secret = 'abc';

    // return new Promise(resolve => {
    const r = new Promise(resolve => {
        const success = (user = 'ss') => {
            console.log('getAuthorizedUserTokens success', 'user', user);
            
            client.query(`SELECT * FROM users WHERE user_name = '${user}'`, (err, result) => {
                if (err) {
                    error(err);
                } else {
                    if (!result.rows.length) {
                        error(new Error('!result.rows.length'));
                        return;
                    }

                    const sec = secret + result.rows[0].password;

                    const object = {
                        user,
                        param1: 'value1',
                        // exp: Math.round(Date.now() / 1000 + 60 * 10), // expired in 10 minutes
                        exp: Math.round(Date.now() / 1000 + 10), // expired in 10 seconds
                    };
                    const objectRefresh = {
                        user,
                        exp: Math.round(Date.now() / 1000 + 60 * 60 * 24 * 30), // expired in 30 days
                        // verify: fingerprint.hash,
                    };

                    const token = jwt.sign(object, secret);
                    // const token = jwt.sign(object, sec);
                    // const tokenRefresh = jwt.sign(objectRefresh, secret);
                    const tokenRefresh = jwt.sign(objectRefresh, sec);

                    const tokens = {
                        access: token,
                        refresh: tokenRefresh,
                    };

                    resolve(tokens);
                }
            })
        };

        const error = (err) => {
            // console.log('error: ' + JSON.stringify(err), err.message, err.name, err.stack)
            console.log('authorization error', err.message);
            resolve(null);
        };

        if (!username || !password) {
            const accToken = token || req.jwtAccess;
            if (accToken) {
                jwt.verify(accToken, secret, function(err, decoded) {
                    console.log('verify access token', decoded);

                    if (err) {
                        if (err instanceof jwt.TokenExpiredError) {
                            error(new Error('expired'));
                            return;
                        }

                        error(err);
                        return;
                    }

                    const user = decoded.user;
                    if (!user) {
                        error(new Error('!user'));
                        return;
                    }

                    success(user);
                });
            } else if (req.cookies.jwtRefresh) {
                const dec = jwt.decode(req.cookies.jwtRefresh);
                const usr = dec.user;

                client.query(`SELECT * FROM users WHERE user_name = '${usr}'`, (err, result) => {
                    if (err) {
                        error(err);
                    } else {
                        if (!result.rows.length) {
                            error(new Error('!result.rows.length'));
                            return;
                        }

                        const hash = result.rows[0].password;
                        const sec = secret + hash;

                        // jwt.verify(req.cookies.jwtRefresh, secret, function(err, decoded) {
                        jwt.verify(req.cookies.jwtRefresh, sec, function(err, decoded) {
                            console.log('veryfy refresh token', decoded);

                            if (err) {
                                if (err instanceof jwt.TokenExpiredError) {
                                    error(new Error('refresh expired'));
                                    return;
                                }

                                error(err);
                                return;
                            }

                            const user = decoded.user;

                            // console.log('verify', verify, 'fingerprint', JSON.stringify(fingerprint), 'isEqual', verify === fingerprint.hash);

                            // if (!user || verify !== fingerprint.hash) {
                            if (!user) {
                                error(new Error('!user'));
                                return;
                            }

                            success(user);
                        });
                    }
                })
            } else {
                error(new Error('logged out user'));
            }
            return;
        }

        console.log('getAuthorizedUserTokens here 1');
        

        const bcrypt = require('bcrypt');
        console.log('getAuthorizedUserTokens here 1.2', `SELECT * FROM users WHERE user_name = '${username}'`);

        client.query(`SELECT * FROM users WHERE user_name = '${username}'`, (err, result) => {
            console.log('getAuthorizedUserTokens here 2');
            
            if (err) {
                error(err);
            } else {
                if (!result.rows.length) {
                    error(new Error('!result.rows.length'));
                    return;
                }

                const hash = result.rows[0].password;
                bcrypt.compare(password, hash, function(err, result) {
                    let isAccess = !!result;

                    console.log('checks user password match', username, result);

                    if (isAccess) {
                        success(username as string);
                    } else {
                        error(new Error('wrong password'));
                    }
                });
            }
        })
    });

    console.log('getAuthorizedUserTokens', 'r', r);
    

    return r;
};

// TODO
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500);
    res.send('error: ' + err.message + '; status: ' + err.status);
}

app.get('/auth/is-authorized', errorHandler, async (req, res) => {
    // TODO: Каждый раз идёт запрос в базу. Надо бы постараться этого избежать.
    res.send(Boolean(await getAuthorizedUserTokens(req, res)));
})

app.post('/auth/authorize', authorizationMiddleware, errorHandler, async (req, res, next) => {
    res.send(``);
})

app.use('/auth/register', (req, res) => {
    const {username, password} = req.query || {};
    console.log('register username', username, 'password', password);

    const bcrypt = require('bcrypt');

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log('hash', hash)
        // console.log('err', err)
        // Store hash in your password DB.
        // res.send('test pass: ' + hash);
        client.query(`INSERT INTO users VALUES (DEFAULT, '${username}', '${hash}');`, (err, result) => {
            if (err) {
                console.log('err', err)
                res.send(err);
            } else {
                console.log(result.rows);
                // console.log(err, res)
                // res.send(result.rows)
                res.send('registerd!')
            }
            // client.end();
        })
    });
})

app.use('/auth/update-password', (req, res) => {
    const {username, password} = req.query || {};
    console.log('update pass username', username, 'password', password);

    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        client.query(`UPDATE users SET password = '${hash}' WHERE user_name = '${username}';`, (err, result) => {
            if (err) {
                console.log('err', err)
                res.send(err);
            } else {
                if (!result.rowCount) {
                    // console.log('result.rows', result.rows, result)
                    res.send('no user??');
                    return;
                }
                console.log(result.rows);
                res.send('password updated!')
            }
        })
    });
})

app.get('/auth/logout', (req, res) => {
    onLogoutCleanup(res);

    const backUrl = req?.body?.backUrl || req?.query?.backUrl || '/';
    res.redirect(backUrl);
})

// Static files.
const pathToStaticFiles = path.resolve(__dirname, '../');
app.use(express.static(pathToStaticFiles));

// Frontend app.
app.engine('html', require('ejs').renderFile);
app.get('*', authorizationMiddleware, errorHandler, (req, res) => {
    const pathToHtml = path.resolve(__dirname, '../base.html');
    const { isUserAuthorized } = req;

    if (isUserAuthorized && req._parsedUrl.pathname === '/') {
        res.redirect('/portfolio');
        return;
    } else if (!isUserAuthorized && req._parsedUrl.pathname === '/logout') {
        res.redirect('/');
        return;
    }

    const env = {
        user: {
            isUserAuthorized,
        },
    };
    res.render(pathToHtml, {
        env: JSON.stringify(env),
    });
});



// TODO: refactor
app.get('/db', (req, res) => {
    client.query('SELECT * from employee', (err, result) => {
        if (err) {
            res.send(err);
        } else {
            // console.log(res.rows)
            // console.log(err, res)
            res.send(result.rows)
        }
        // client.end();
    })
})

app.use('/api/v1/:ticker?/:dateFrom?/:dateTo?', graphqlHTTP(async (req, res, graphQLParams) => {
    // console.log('graphqlHTTP', !!req, req.query, req.params, req.variables, graphQLParams)

    const id = req.params.ticker;
    graphQLParams.query = `{ posts(id: "${id}") { title, id } }`;


    return {
        schema: BlogAppSchema,
        graphiql: false,
    };
}));

if (mode === 'development') {
    app.use('/graphiql', graphqlHTTP({
        // schema: schema,
        schema: BlogAppSchema,
        rootValue: root,
        graphiql: true
    }));
}

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`)
})


// };

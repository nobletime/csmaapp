'use strict';

const { http, https } = require('follow-redirects');
const httpsNoRedirect = require('https');
const httpNoRedirect = require('http');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');

const express = require('express'), session = require("express-session"), passport = require('passport'), LocalStrategy = require('passport-local'), flash = require('connect-flash');
const moment = require('moment');
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto")

const mdb = require('./mod/db.js');
const mysql = require('./mod/mysql.js');
const { send365Email, sendGmail } = require("./mod/email");
//const { getStaticCookie, asyncGetCookie, getCookie } = require('./mod/tokenConfig');

//const Captcha = require("2captcha");
const CLIENT_ID = process.env.CLIENT_ID || "Ae_G_QedpxfnZPk2Jm9FhtLgaU_ofF0xwSQQEjgrryTqywwIBk65bCxpBhTMkF06jhpFfwIVtYVH0rvs" // live or sandbox

const app = express({ limit: '50mb' });
app.use(express.text({}));
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb', extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));


app.use(
  session({
    secret: "autocheck-report-vehicle",
    rolling: true,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 21600000, secret: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const adminUser = {
  username: 'admin',
  password: '#Autocheck5000',
  // passwordHash: 'Rest007!',
  // id: 1
}
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
  passReqToCallback: true
},
  async (req, username, password, done) => {
    const user = req.body.username.toLowerCase();
    //  const found = await mdb.findOne('users', { 'username': user });
    const found = await mysql.findByUsername(user);
    if (!found)
      return done(null, false, req.flash('message', 'Wrong Username'))

    if (!await bcrypt.compare(password, found.password))
      return done(null, false, req.flash('message', 'Wrong Credential'))

    if (!req.body.remember) {
      req.session.cookie.maxAge = 300000
    }
    return done(null, user)
  }
))

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/signin');
}

// app.post('/signin', passport.authenticate('local', {
//   successRedirect: '/users:/onboarding',
//   failureRedirect: '/signin'
// }))




app.get('/users/:username', async (req, res) => {
  const user = req.params.username.toLowerCase();
  // const found = await mdb.findOne('users', { 'username': user });
  const found = await mysql.findByUsername(user);
  const message = req.flash('message');
  if (!found) {
    req.flash('message', "Please login");
    return res.redirect('/signin');
  }
  //   getCookie(cookie=>{
  // console.log(cookie)

  //   })
  if (found.active && found.active == 'No') {
    req.flash('message', "Your account has been terminated");
    return res.redirect('/signin');
  } 

  res.render('index', { email: found.email, credits: found.credits, username: user, verifypayment: "none", message: message, CLIENT_ID : CLIENT_ID });
});

app.post('/addcredits', async (req, res) => {
  const verify_payment = req.body.verify_payment;
  const username = req.query.username.toLowerCase();
  if (verify_payment != "done") {
    req.flash('message', "Unauthorized payment!");
    return res.redirect(`/users/${username}`);
  }

  //const found = await mdb.findOne('users', { 'username': username });
  const found = await mysql.findByUsername(username);
  if (!found) {
    req.flash('message', "Please login");
    return res.redirect('/signin');
  }

  let totalcredits = Number(found.credits) + Number(req.body.credits_add)

  //const updatecreidts = await mdb.updateOne('users', { 'username': username }, { credits: totalcredits});

  const updatecreidts = await mysql.updateCreditForUser(username, totalcredits);

  req.flash('message', `${req.body.credits_add} credits added!`);
  return res.redirect(`/users/${username}`);
});



app.get('/', (req, res) => {
return res.sendFile(path.join(__dirname, "public", "html", "index.html"))

});



app.get('/onboarding', isAuthenticated, function (req, res) {
  res.render('users', { message: "" })
  //res.sendFile(path.join(__dirname + '/popup.html'));
});




app.post('/autocheck', isAuthenticated, async (req, res) => {
  console.clear();
  const vin = req.body.vin;
  const email = req.body.email;
  const username = req.query.username;
  // const _id = 
  const found = await mysql.findByUsername(username);
  // const found = await mdb.findOne("users", { username: username })

  if (found.active && found.active == 'No') {
    return res.status(403).send("Your account has been terminated");
 //   req.flash('message', "Your account has been terminated");
  //  return res.redirect('/signout');
  }

  if (found.credits - 5 < 0) {
   return  res.status(405).send( "Not Enough Credits. Please purchase credits!");
 //   req.flash('message', `Not Enough Credits, Please purchase credits`);
//    return res.redirect(`/users/${username}`);
  }

  const auth = await mysql.readToken();

  const options = {
    hostname: 'dmsapp.dealercenter.net',
    //port: 443,
    path: '/inventory/vehicle/viewautocheckreport?Id=&vin=' + vin + '&type=1&isnew=false&lang=1&auctionId=',
    method: 'GET',
    headers: {
      'Cache-Control': 'max-age=0',
      'Origin': 'https://idsvr.dealercenter.net',
      'Host': 'dmsapp.dealercenter.net',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'Cookie': auth.token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
    }
  }

  https_request(https, options, async (pagedata) => {
    // if (pagedata.indexOf('Object moved') > -1) {
    //   loginToSite(httpsNoRedirect,'nobletime', '!Voice5000', getStaticCookie() +";" + set_cookies.join(), pagedata => {

    //   })


    // } else 
    if (pagedata.indexOf('autocheck') > -1) {

      //res.redirect('/autocheck')

    //  res.send(pagedata);

    const newcredits = Number(found.credits) - 5;
    res.status(200).send(JSON.stringify({credits:newcredits, pagedata:pagedata, vin: vin}));
      // const result = await mdb.updateOne("users", { username: username }, { credits: found.credits - 5 })
      const result = await mysql.updateCreditForUser(username, newcredits);

      const attachments = [
        {   // utf-8 string as an attachment
          filename: `${vin}.html`,
          content: pagedata
        }
      ]
     
     return sendGmail(email, `The VIN Report for ${vin}`, `  The Vin Report for ${vin} is attached.`, attachments)

    } else {

      // request.flash('message', `Server too busy, your account was not charged! 
      //                            Alternatively you can contact support or try again later! `);
      // return res.redirect(`/users/${username}`);
      return res.status(302).send('There was a problem with the VIN, your account was not charged!  Alternatively you can contact support or try again later!');
    }

  })
})


app.get('/user-list', isAuthenticated, async (req, res) => {
  // const result = await mdb.find("users", {});
  const result = await mysql.findAllUser("users");

  result.forEach(e => e['DT_RowId'] = e.id.toString());

  let tableData = { "data": result, "options": [], "files": [], "debug": [{ "query": "SELECT  `id` as 'id', `name` as 'name', `created_by` as 'created_by', `type` as 'type', `email` as 'email', `start_date` as 'start_date', `interval` as 'interval', FROM  `scheduled_events` ", "bindings": [] }] };

  res.send(JSON.stringify(tableData));
});

app.post('/user-list', isAuthenticated, async (req, res) => {
  let firstKey = "";
  let result = "";

  let templateTData = { "data": [], "debug": [{ "query": "DELETE FROM  `datatables_demo` WHERE (`id` = :where_1 )", "bindings": [{ "name": ":where_1", "value": "3", "type": null }] }] };

  switch (req.body.action) {
    case 'create':
      //  let obj = data[0];
      // // obj.clinic_id = new Date().getTime().toString();
      //  result = await mdb.save("users", obj);
      //  templateTData.data = [obj];
      //  obj['DT_RowId'] = obj._id.toString();
      //  res.send(JSON.stringify(templateTData));

      break;
    case 'edit':
      let data = JSON.parse(req.body.data)
      firstKey = Object.keys(data)[0];
      let datatmp = data[firstKey];
      //query = { 'id': firstKey};

      // result = await mdb.updateOne("users", query, datatmp);
      result = await mysql.updateUser(Number(firstKey), datatmp);

      datatmp['DT_RowId'] = firstKey;
      templateTData.data = [datatmp];
      res.send(JSON.stringify(templateTData));


      // if (datatmp.active == "Yes") {
      //   let subject = "C-GASP Screener Service Registeration";
      //   const pass = 'CsmaTraker1999';
      //   const surveylink = `https://airwayassessment.azurewebsites.net/qrcode?cid=${record.clinic_id}`
      //   const body = `Your C-GASP Screener Service link to generate QR-Code and view survey results is below:<br/><a href="${surveylink}">${surveylink}</a>`;
      //   await send365Email('CSMA-Tracker@csma.clinic', [record.email.toLowerCase()], subject, body, "Rest Tracker Report", pass, null);
      // }

      break;

    case 'remove':

      // let id = data[0];
      // newvalues = data[firstKey];
      //  query = { 'username': newvalues.username};
      //   result = await mdb.deleteOne("onboarding", query);
      result = await mysql.deleteUser(req.body.data[0].username);
      res.send(templateTData)
      break;
  }

});

app.get('/promo-list', isAuthenticated, async (req, res) => {
  //const result = await mdb.find("promocodes", {});

  const result = await mysql.findAllPromo();

  result.forEach(e => e['DT_RowId'] = e.promocode.toString());

  let tableData = { "data": result, "options": [], "files": [], "debug": [{ "query": "SELECT  `id` as 'id', `name` as 'name', `created_by` as 'created_by', `type` as 'type', `email` as 'email', `start_date` as 'start_date', `interval` as 'interval', FROM  `scheduled_events` ", "bindings": [] }] };

  res.send(JSON.stringify(tableData));
});

app.post('/promo-list', isAuthenticated, async (req, res) => {
  let firstKey = "", newvalues, query = "";
  let data = req.body.data, result = "";

  let templateTData = { "data": [], "debug": [{ "query": "DELETE FROM  `datatables_demo` WHERE (`id` = :where_1 )", "bindings": [{ "name": ":where_1", "value": "3", "type": null }] }] };

  switch (req.body.action) {
    case 'create':
      let obj = data[0];
      // obj.clinic_id = new Date().getTime().toString();
      //   result = await mdb.save("promocodes", obj);
      obj.promocode =   obj.promocode.toLowerCase()
      result = await mysql.insertPromo(obj.promocode, obj.credits);
      templateTData.data = [obj];
      obj['DT_RowId'] = obj.promocode.toString();
      res.send(JSON.stringify(templateTData));

      // let subject = "C-GASP Screener Service Registeration";
      // const pass = 'CsmaTraker1999';
      // const surveylink = `https://airwayassessment.azurewebsites.net/qrcode?cid=${obj.clinic_id}`
      // const body = `Your C-GASP Screener Service link to generate C-GASP Screener and view the results is below:<br/><a href="${surveylink}">${surveylink}</a>`;
      // await send365Email('CSMA-Tracker@csma.clinic', [obj.email.toLowerCase()], subject, body, "Rest Tracker Report", pass, null);

      break;
    case 'edit':

      firstKey = Object.keys(data)[0];
      let datatmp = data[firstKey];
      //query = { 'id': firstKey};

      // result = await mdb.updateOne("users", query, datatmp);
      result = await mysql.updatePromo(firstKey,datatmp.credits, datatmp.promocode);

      datatmp['DT_RowId'] = firstKey;
      templateTData.data = [datatmp];
      res.send(JSON.stringify(templateTData));


      break;

    case 'remove':

      firstKey = Object.keys(data)[0];
      newvalues = data[firstKey];
      //   query = { 'promocode': newvalues.promocode };
      //    result = await mdb.deleteOne("promocodes", query);
      result = await mysql.deletePromo(newvalues.promocode);
      res.send(templateTData)
      break;
  }

});

app.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), (req, res) => {
  if (req.body.username.toLowerCase() == "admin") {
    res.redirect(`/onboarding`);
  } else {
    res.redirect(`/users/${req.body.username.toLowerCase()}`);
  }
});


app.get('/signin', async (req, res) => {
  const message = req.flash('message')
  res.render('login.ejs', { message: message });
});


app.post('/signup', async (req, res) => {

  const user = req.body.username.toLowerCase();
  const promo = req.body.promocode.toLowerCase();
  let credits = 0;

  const found = await mysql.findByUsername(user);

  if (found) {
    req.flash('message', user + " is not available! Please choose another username.");
    return res.redirect('/signin');
  }

  if (promo) {
    const foundpromo = await mysql.findPromo(promo);
    // const foundpromo = await mdb.findOne('promocodes', { 'promocode': promo });
    if (foundpromo) {
      credits = Number(foundpromo.credits);
      //  await mdb.deleteOne('promocodes', { 'promocode': promo });
      await mysql.deletePromo(promo);
    } else {
      req.flash('message', `The promo code entered was not valid. Your account was not created!`);
      return res.redirect('/signin');
    }
  }

  const newuser = {
    'username': user,
    'email': req.body.email.toLowerCase(),
    'password': bcrypt.hashSync(req.body.password, 12),
    'created_date': new Date(),
    'type': 'single',
    'credits': credits,
    'token': randomUUID(),
    'active': 'Yes',
    'promocode': promo
  }

  // const result = await mdb.save('users', newuser)
  const savedUser = await mysql.insertUser(newuser)

  req.flash('message', "Your account has been created! You can login now.");
  return res.redirect('/signin');

});


app.get('/signout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/signin');
  });
});

app.get('/password-reset', async (req, res)=> {
  if (!req.query.username && !req.query.token){
    return res.redirect('/signin');
  }
  const user = req.query.username.toLowerCase();
  const token = req.query.token;
  

  const found = await mysql.findByUsername(user);

  if (!found) {
    req.flash('message', "username does not exist");
    return res.redirect('/signin');
  }

  if (found.token != token ) {
    req.flash('message', "Wrong token likely link is expired, please contact support");
    return res.redirect('/signin');
  }

  return  res.render('password-reset', { username: user, message: "" })
})

app.post('/password-reset', async (req, res) => {
  const user = req.body.username.toLowerCase();
  const found = await mysql.findByUsername(user);

  const result = await mysql.updateUser( found.id,{'token' : randomUUID(),  'password': bcrypt.hashSync(req.body.newpassword, 12)})
  
req.flash('message', "Your password has been successfully reset");
return res.redirect('/signin');

})


app.post('/password-reset-internal', isAuthenticated, async (req, res) => {
  const user = req.body.username.toLowerCase();
  const currentpassword = req.body.currentpassword;
  const found = await mysql.findByUsername(user);

  
  if (!await bcrypt.compare(currentpassword, found.password)){
    req.flash('message', "Your current password didn't match, if you forgot your password, try resetting on sign-in page");
    return res.redirect(`/users/${user}`);
  }

  const result = await mysql.updateUser( found.id,{'token' : randomUUID(),  'password': bcrypt.hashSync(req.body.newpassword, 12)})
  
req.flash('message', "Your password has been successfully reset");
return res.redirect(`/users/${user}`);

})


app.post('/forgot-password', async (req, res)=> {
  
  const user = req.body.username.toLowerCase();
  const found = await mysql.findByUsername(user);

  if (!found) {
   req.flash('message', `Username '${user}' does not exist` );
   res.redirect('/signin');
  }

  req.flash('message', "An email with link to reset your password was to the email on the account" );
  res.redirect('/signin');

const resetlink = `${req.protocol}://${req.get('host')}/password-reset?username=${user}&token=${found.token}`
   sendGmail(found.email, `The Vin Report Password Reset`, ` <b>Your password reset link:</b><br/><br/> ${resetlink}`, null)
});


function https_request(httpsVar, options, cb) {
  var pagedata = "";
  const req = httpsVar.request(options, res => {
    res.on('data', d => {
      pagedata = pagedata + d;
    })

    res.on('end', function () {
      cb(pagedata)
    });

  })

  req.on('error', error => {
    console.error(error);
  })

  req.end();
}

String.prototype.replaceAll = function (search, toReplace) {
  const replacer = new RegExp(search, 'g')
  return this.replace(replacer, toReplace);
}

// function getHost(){
//   return req.protocol + '://' + req.get('host') // + req.originalUrl;
// }


const port = process.env.PORT || 3030;
app.listen(port);
const captchaKey = '0d2bbb4da84be9b455dea3e468c56b75';

console.log('Server started! At http://localhost:' + port);



// if (!process.env.prod) 
//   process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// const filename = 'C:\\Users\\Hesam.Motahar\\Downloads\\Archive\\eMRI System\\Website\\AutoCheck\\report.html';
// const pageData = fs.readFileSync(filename, 'utf8');
//  pdf.create(pageData).toFile('C:\\Users\\Hesam.Motahar\\Downloads\\Archive\\eMRI System\\Website\\AutoCheck\\report.pdf', function(err, res){
//    if (err) throw err.message
//    console.log('PDF file created');
//  });

// server.post(authPostRoute, function(req, res, next) {

//   // generate the authenticate method and pass the req/res
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/'); }

//     // req / res held in closure
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.send(user);
//     });

//   })(req, res, next);
// });

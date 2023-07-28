## Project - OTP-Verification

## Technologies applied 
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose
- Ethereal (for dummy email)

## Setup

### Clone repo
```sh
$ https://github.com/Amit01k/Email_OTP_Verification.git
```

### Open Email_OTP_Verification Folder
```sh
$ Email_OTP_Verification
```
### Install All Dependencies
```sh
$ npm install
```

### Add Mongo DB String 
```yaml
- Note Add Mongo DB string to connect with database
- Open Email_OTP_Verification folder>index.js file>enter mongoDB connection String
{
    mongoose.connect(process.env.DATABASE||'enter your mongo DB connection string', {
    useNewUrlParser: true,})
}
```
### Run the Application
```sh
$ npm start
```
### input for create user
- user input
- first_name: user first name
- last_name: user last name
- phone_number: mobile number of user and this is unique beacause every user have own mobile number
- email: email of the user and this is unique beacause every user have email Id.

```yaml
{
    "first_name":"Ankit",
    "last_name":"singh",
    "email":"ankit@gmail.com",
    "phone_number":"7979944122"
}
```


### userModel
- User Model
```yaml
{ 
  "first_name": {string, mandatory},
  "last_name": {string, mandatory},
  "phone_number": {string, mandatory, unique},
  "email": {string, mandatory, valid email, unique},
  "otp":{Number},
  "isVerified" :{Boolean,default:false}
  "createdAt": {timestamp},
  "updatedAt": {timestamp}
}
```
## User APIs 

### POST /register
- Create a user document from request body.
- Returning HTTP status 201 on a succesful user creationed. Also return the user document. The response should be a JSON object like [this](#successfully-user-created-response-structure)
- Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like [this](#error-response-structure)

## Response

### Successful Response structure
```yaml
{
  status: true,
  message: 'Success',
  data: {

  }
}
```

### Successfully User Created Response structure
```yaml
{
    "status": true,
    "message": "Registration successful. Please verify your email with OTP."
}
```
### Error Response structure
```yaml
{
  "status": false,
  "message": ""
}
```

### POST /login
- Allow an user to login with their email and otp.
- if our not registered so it will throw an error like [this](#user-not-registered) 

### Successful Response structure For Login
```yaml
{
    "msg": "token generated successfully",
    "token": "token will show here when user successfully created"
}
```

### GET /user
- Returns all users in the collection that aren't deleted. Return all the fiels. Response example [here](#get-user-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 

### Get user response
```yaml
{
    "status": true,
    "message": "users list",
    "data": [
        
    ]
}
```

### User Not Registered
```yaml
{
    "status": false,
    "message": "Email not registerd, please regirster yourself"
}
```

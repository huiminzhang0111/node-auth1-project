/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

const db = require('../../data/db-config')
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      message: "You shall not pass!",
      status: 401
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
  try {
    const existing = await db('users')
      .where('username', req.body.username)
      .first()

    if (existing) {
      next({
        status: 422,
        message: "Username taken"
      })
    } else {
      next()
    }
  } catch(err) {
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async(req, res, next) => {
  try {
    const existing = await db('users')
      .where('username', req.body.username)
      .first()
    if (!existing) {
      next({
        status: 401,
        message: "Invalid credentials"
      })
    } else {
      next()
    }
  } catch(err) {
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  const { password } = req.body
  if (password === undefined || password.length <= 3) {
    next ({
      status: 422,
      message: "Password must be longer than 3 chars"
    })
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}
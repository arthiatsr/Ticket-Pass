var db = require("../models");

const nodemailer = require("nodemailer");
require("dotenv").config();

// function to send a confirmation email 
function emailer(userEmail, ticketObj) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jamesriddle@utexas.edu',
      pass: process.env.GMAIL_PASS
    }
  });
  
  const mailOptions = {
    from: 'jamesriddle@utexas.edu',
    to: userEmail,
    subject: 'Listing Confirmation',
    text: `Your ticket has been posted!
      Section: ${ticketObj.sectionNumber}
      Row: ${ticketObj.rowNumber}
      Seat: ${ticketObj.seatNumber}
      Listing Price: $${ticketObj.price}
    `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

module.exports = function(app) {
  // Get all examples
  app.get("/api/sell-price/:id", function(req, res) {
    db.FaceValue.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(ticketFaceValue) {

      res.json(ticketFaceValue);
    });
  });

  app.get("/user-email/:email", function(req, res) {
    db.TicketMaster.findAll({
      where: {
        email: req.params.email
      }
    })
    .then(function(userListing) {
      // going to be an array of objects
      res.render("user-listing", { 
        listing: true,
        listingArray: userListing 
      });
    })
    .catch(() => {
      console.log("there's been a db query error");
      res.status(500).end();
    });
  });

  app.post("/api/new-listing", function(req, res) {

    const { sectionNumber, rowNumber, seatNumber, ticketId, userName, email, price } = req.body;

    db.TicketMaster.create({

      section_number: sectionNumber,
      row_number: rowNumber,
      seat_number: seatNumber,
      ticket_id: ticketId,
      price: price,
      user_name: userName,
      email: email

    }).then(() => {
      emailer(email, req.body);
      // going to be an array of objects
      res.status(201).end();
    })
    .catch(() => {
      console.log("there's been a db query error");
      res.status(500).end();
    });
  });

  app.get("/api/venue", function(req, res) {
    db.TicketMaster.findAll({})
    .then(function(allTickets) {
      res.json(allTickets);
    })
    .catch(() => {
      console.log("there's been a db query error");
    });
  });

  app.delete("/api/delete/listing/:ticketId", function(req, res) {
    db.TicketMaster.destroy({
      where: {
        ticket_id: req.params.ticketId
      }
    }).then(function() {

      res.send(204).end();
    });
  });

};
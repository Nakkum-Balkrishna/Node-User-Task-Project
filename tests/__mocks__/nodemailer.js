// ref: https://stackoverflow.com/questions/53420562/mock-nodemailer-createtransport-sendmail-with-jest/68938151#68938151
class CreateTransportClass {
    sendMail(){
      //console.log("mocked mailer");
    }
}
  
const createTransport = ()=>{
    return new CreateTransportClass()
}
  
module.exports = {
    createTransport
}
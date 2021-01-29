const contact = {
    init:function(){
        console.log('contact script initialized');
        // https://dashboard.emailjs.com/admin/integration
        emailjs.init('user_hRzpVxI2UEa1mITnxqPRh');
        contact.eventListenersInitialization()
    },
    eventListenersInitialization:function(){
        //get form element, add eventListener
        document.querySelector('.contact__action__form').addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('test eventListener')
            // emailjs.send(serviceID, templateID, templateParams, userID);
            // emailjs.sendForm(serviceID, templateID, templateParams, userID);
            emailjs.sendForm('default_service', 'contact_form', this)
                .then(function() {
                    console.log('SUCCESS!');
                }, function(error) {
                    console.log('FAILED...', error);
                });
        });
    },
}

document.addEventListener('DOMContentLoaded', contact.init);
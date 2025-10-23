const contact = {
    init:function(){
        // console.log('contact script initialized');
        // https://dashboard.emailjs.com/admin/integration
        emailjs.init('user_hRzpVxI2UEa1mITnxqPRh');
        contact.eventListenersInitialization();
    },
    eventListenersInitialization:function(){
        //get form element, add eventListener
        document.querySelector('.contact__action__form').addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('test eventListener')
            // emailjs.sendForm(serviceID, templateID, templateParams, userID);
            emailjs.sendForm('default_service', 'contact_form', this)
                .then(function() {
                    console.log('email SUCCESS!');
                    //show success modal;
                    contact.showFormModal();
                    //reset form data
                    document.querySelector(".contact__action__form").reset();
                }, function(error) {
                    console.log('email FAILED', error);
                    //show failure modal;
                    contact.showFormModal(error);
                });
        });
    },
    showFormModal:function(error){
        let modal = document.getElementById("contact__form__modal");
        let pageMask = document.querySelector('#page-mask');

        //modify popup if fail or success
        if (!error) {
            modal.classList.add('success-modal');
            modal.classList.remove('fail-modal');
            modal.querySelector('p').innerHTML = 'Email envoyé avec succès'
        } else {
            modal.classList.add('fail-modal');
            modal.classList.remove('success-modal');
            if (error.text = 'The g-recaptcha-response parameter not found') {
                modal.querySelector('p').innerHTML = 'Veuillez cocher la case "Je ne suis pas un robot"'
            } else {
                modal.querySelector('p').innerHTML = 'Une erreur est survenue, veuillez réessayer svp'
            }
        }
        //Show modal
        modal.classList.add('show-modal');
        pageMask.style.display = 'block';

        // When the user clicks on <span> (x), close the modal
        let btnClose = document.getElementsByClassName("contact__form__modal__close")[0];
        btnClose.onclick = function() {
            modal.classList.remove('show-modal');
            pageMask.style.display = 'none';
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.classList.remove('show-modal');
                pageMask.style.display = 'none';
            }
        }
        // remove modal after 5 seconds
        setTimeout(function(){ 
            modal.classList.remove('show-modal');
            pageMask.style.display = 'none';
        }, 5000);
    }

}

document.addEventListener('DOMContentLoaded', contact.init);
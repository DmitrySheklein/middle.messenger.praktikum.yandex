(function () {
    const form = document.forms[0];

    function onSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        console.log(values);
    }
    if(form){
        form.addEventListener('submit', onSubmit)
    }
})();
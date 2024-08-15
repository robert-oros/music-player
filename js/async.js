let closeBtn = document.querySelectorAll(".del");
Array.from(closeBtn).map(elem => {
    elem.addEventListener("click", function(e){
        let href = elem.href;
        e.preventDefault();
        
        fetch(href, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json'
                    },
        }).then(response => {
            if(response.status == 200) {
                elem.closest(".trelem").remove();
            } else  {
                console.log(response.err);
            }
        }).catch(err => console.log(err))

    });
})

let edit = document.querySelector(".edit");
Array.from(edit).map(elem => {
    edit.addEventListener("click", function(e){
        e.preventDefault();
        let href = elem.href
            fetch(href, {
                method: "GET"
            }).then(response => { 
                return response.json() 
            })
            .then(myJson => { 
                console.log(JSON.stringify(myJson)); 
            })
    })
})

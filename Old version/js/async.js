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

formElem = document.querySelector(".form-data");
formElem.addEventListener("submit", function(e){
    e.preventDefault();

    let form = new FormData(formElem);
    let title = form.get("title");
    let autor = form.get("autor");
    console.log("Title: " + title + "\n" + "Autor: " + autor);

    
})

// let editBtn = document.querySelector(".editBtn");
// Array.from(editBtn).map(elem => {
//     editBtn.addEventListener("click", function(e){
//         e.preventDefault();

//         let href = elem.href;
//         let data = {
//             title: FormData.title.value,
//             autor: FormData.autor.value
//         }

//         fetch(href, {
//             method: "POST",
//             body: JSON.stringify(data),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).then(response => response.json())
//           .then(data => console.log(JSON.stringify(data)))
//           .catch(err => console.log(err));
//     });
// })
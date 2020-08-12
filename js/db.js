// offline data
db.enablePersistence().catch(function(err){
    if(err.code =='failed-precondition')
    {
        // mungkin banyak tab yg dibuka
        console.log('persistence failed');
    }
    else if(err.code == 'unimplemented')
    {
        // mungkin browser tidak mendukung
        console.log('persistence not available')
    }
})

// realtime listener
db.collection('recipes').onSnapshot(function(snapshot){
    // console.log(snapshot.docChanges());
    snapshot.docChanges().forEach(function(change){
        // console.log(change,change.doc.data(), change.doc.id);

        if(change.type==="added")
        {
            // alert('data added');
            renderRecipe(change.doc.data(), change.doc.id);
        }
        if(change.type==="removed")
        {
            // alert('data removed');
        }
    });
});


// add recipes

const form = document.querySelector('form');
form.addEventListener('submit',function(evt){
    evt.preventDefault();

    const recipe = {
        title:form.title.value,
        ingredients:form.ingredients.value
    }

    db.collection('recipes').add(recipe)
    .catch(function(err){
        console.log(err);
    })

    form.title.value='';
    form.ingredients.value='';
});
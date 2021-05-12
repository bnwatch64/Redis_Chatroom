const ui = new UI();
const ft = new Fetch();

//add event listeners

const search = document.getElementById("city");
const button = document.getElementById("submit");


function togglePopup(){
    //document.getElementById("content").style.display = "block";
    //document.getElementById("buttonBack").style.display = "block";
    const currentVal = search.value;

   ft.getCurrent(currentVal).then((data) => {
      if(data.cod != "404"){
      ui.populate(data);   

      displayPopup();}

      else{
        let alertContent = `
          <div class="alert alert-dismissible alert-warning" style="display: block;">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Action failed!</h4>
            <p class="mb-0">Invalid input! Please try again with another city.</p>
          </div>
        `;

        document.getElementById('alert-box').innerHTML = alertContent;
      }
  });
}

function disPopup(){
    document.getElementById("content").style.display = "none";
    document.getElementById("buttonBack").style.display = "none";
}

function displayPopup() {
  document.getElementById("popup-1").classList.toggle("active");
}

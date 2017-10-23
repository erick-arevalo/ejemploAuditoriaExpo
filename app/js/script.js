var toDoList = document.getElementById("toDoList"),
tasksList;

function newAjax()
{
	var xmlhttp=false;
	try
	{
		xmlhttp = new ActivexObject('Msxml2.XMLHTTP');
	} catch(e)
	{
		try
		{
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		} catch(e)
		{
			xmlhttp = false;
		}
	}

	if (!xmlhttp && typeof XMLHttpRequest != 'undefined')
	{
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function getTasks(){
    let ajax = newAjax();
    ajax.open("GET","data/data.json",true);
    ajax.onreadystatechange = () =>
    {
        if(ajax.readyState = 4)
        {
            if(typeof tasksList === undefined)
            {
                tasksList = []
            }
            else {
                tasksList = JSON.parse(ajax.responseText);
            }
        }

        if(typeof tasksList === undefined) {
            console.log("There is no data");
        } else {
            tasksList.forEach((value,index)=>{
                let listItem = document.createElement("li");
                listItem.setAttribute("data-id",index);
                listItem.setAttribute("class","toDoList-item");
                listItem.textContent = value.name;
                toDoList.appendChild(listItem);
            });
        }
    }
    ajax.send(null)
}

function createTask() {
    let listItem = document.createElement("li");

}

function start() {
    getTasks();
    console.log(typeof tasksList);
    console.log(tasksList);
}

window.onload = () => 
{
    start();
}
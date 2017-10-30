var tasksList   = new Array();

jQuery(document).ready(start);

function start()
{
    console.log('Started...');
    var toDoList    = jQuery('#toDoList'),
        taskInput   = jQuery('#taskForm');

    jQuery.ajax({
        'url': 'data/data.json',
        'type': 'get',
        'datatype': 'json',
        'success': function(data)
        {
            if(typeof data.tasks === 'object' && data.tasks.length === 0) 
            {
                console.log("There is no data");
            } else 
            {                
                data.tasks.forEach(function(value,index)
                {
                    createTask(toDoList, value,index);
                });
            }            
        },
        "error": function(jqXHR, status, error) {
            console.log("status:", status, "error:", error);
        }
    });

    taskInput.on('submit', function(e) {
        e.preventDefault();
        createTask(toDoList);
    })

    toDoList.on('click', function(e)
    {
        var element =   jQuery(e.target);
        
        if(element.attr('type') === 'checkbox' && !element.attr('checked')) {
            element.parent().addClass('done');
            element.attr('disabled',true);
            alert("Done!!");
        }
    });
}

function createTask(toDoList, value, index) {
    var listItem = jQuery(document.createElement("li")),
        taskInput = jQuery("#toDoTask"),
        task = {"status":"toDo"},
        chkBox = jQuery(document.createElement('input'));
    
    chkBox.attr('type',"checkbox");

    if(typeof value === 'undefined' && typeof index === 'undefined')
    {
        task.name =taskInput.val();
        tasksList.push(task);
        
    } else
    {
        task.name =value.name;
        task.status = value.status;
        listItem.attr("data-id",index);
    }
    
    listItem.attr("class","toDoList-item");    
    listItem.text(task.name);
    listItem.append(chkBox);
    toDoList.append(listItem);
    tasksList.push(task);
}
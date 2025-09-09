async function getTask() { //Función para Get
    
    try {
        
        const response = await fetch('http://localhost:3001/Tareas', {
            method: 'GET',
            headers :{
                'Content-Type': 'application/json'
            }
        })

        const task = await response.json()

        return task    
        
    } catch (error) {

        console.error("Existe un error al obtener las tareas", error)
        throw error
        
    }
}


async function postTask(Tareas) { //Función para Post
    
    try {
        
        const response = await fetch('http://localhost:3001/Tareas', {
            method: 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(Tareas)
                    
        })

        const task = await response.json()

        return task    
        
    } catch (error) {

        console.error("Existe un error al crear las tareas", error)
        throw error
        
    }
}


async function deleteTask(id) { //Función para Delete
    
    try {
        
        const response = await fetch('http://localhost:3001/Tareas/'+id, {
            method: 'DELETE',
            headers :{
                'Content-Type': 'application/json'
            },
            
        })

        const task = await response.json()

        return task    
        
    } catch (error) {

        console.error("Existe un error al eliminar las tareas", error)
        throw error
        
    }
}


async function putTask(Tareas,id) { //Función para put
    
    try {
        
        const response = await fetch('http://localhost:3001/Tareas/'+id, {
            method: 'PUT',
            headers :{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(Tareas)
                    
        })

        const task = await response.json()

        return task    
        
    } catch (error) {

        console.error("Existe un error al editar las tareas", error)
        throw error
        
    }
}

export{ getTask,postTask,deleteTask,putTask }
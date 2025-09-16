async function getUsers() { //Función para Get
    
    try {
        
        const response = await fetch('http://localhost:3001/Usuarios', {
            method: 'GET',
            headers :{
                'Content-Type': 'application/json'
            }
        })

        const users = await response.json()

        return users    
        
    } catch (error) {

        console.error("Existe un error al obtener los usuarios", error)
        throw error
        
    }
}


async function postUsers(Usuarios) { //Función para Post
    
    try {
        
        const response = await fetch('http://localhost:3001/Usuarios', {
            method: 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(Usuarios)
                    
        })

        const users = await response.json()

        return users    
        
    } catch (error) {

        console.error("Existe un error al crear los usuarios", error)
        throw error
        
    }
}

export{ postUsers,getUsers }
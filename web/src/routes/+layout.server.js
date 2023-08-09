
import { SERVER } from '../lib/des_api'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async( { cookies } ) => {
    let user_res = await fetch( `${ SERVER }/user/me`, { 
            method: "GET",
            headers: { 'Authorization': `Bearer ${ cookies.get( 'des_token' ) }`}      
        } 
    )
    let usr = await user_res.json() 

    if ( usr.status == "success" ) {

        cookies.set( 'des_user', JSON.stringify( {
                id: usr.data.user.id, 
                name: usr.data.user.name, 
                email: usr.data.user.email, 
                role: usr.data.user.role,
                provider: usr.data.user.provider, 
                created_at: usr.data.user.created_at, 
                updated_at: usr.data.user.updated_at,
                token: cookies.get( 'des_token' ),
                logged_in: true
            } ), 
            { path: '/' } 
        )
        console.log(`\nLAYOUT LOAD FUNCTION: -> AUTHENTICATION SUCCESS!\n${ JSON.stringify( JSON.parse( cookies.get( 'des_user' ) ), null, 4 ) }\n`
        )
    } else {
        console.log(`\nLAYOUT LOAD FUNCTION: -> AUTHENTICATION FAILED!\n${ JSON.stringify( usr, null, 4 ) }\n`)
            
        cookies.set( 'des_token', "", { path: '/' } )
        cookies.set( 'des_user', JSON.stringify(  { logged_in: false }, { path: '/' } ) )
        
    }
    let user = await JSON.parse( cookies.get( 'des_user' ) )
    return { user }
}


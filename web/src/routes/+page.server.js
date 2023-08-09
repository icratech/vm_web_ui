
import { SERVER } from '../lib/des_api'

/** @type {import('./$types').Actions} */
export const actions = {
    
    login: async( { cookies, request } ) => {

        const data = await request.formData( )
        const email = data.get( 'email' )
        const password = data.get( 'password' )

        let req = new Request( `${ SERVER }/api/auth/login`, { 
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify( { email, password } ) 
        } )
        let res = await fetch( req )
        let auth = await res.json( )
        // console.log(`"\nFORM ACTION: login -> RESPONSE -> auth\n${ JSON.stringify( auth, null, 4 ) }`)

        if ( auth.status === "success" ) { 
            console.log(`\nSUCCESS:\n${ auth.token }\n` )
            cookies.set( 'des_token', auth.token, { path: '/' } )

            let des_token = await cookies.get( 'des_token' )
            console.log(`"\nFORM ACTION: login -> LOGGED IN! -> des_token\n${ des_token }`)
        }
     },

     logout: async( { cookies } ) => {
     
        let req = new Request( `${ SERVER }/api/auth/logout`, { 
            method: "GET",
            headers: { 'Authorization': `Bearer ${ cookies.get( `des_token` ) }` }, 
            credentials: "include"   
        } )
        let res = await fetch( req )
        let logout_res = await res.json( ) 
        console.log( `FORM ACTION: logout -> RESPONSE -> logout_res:\n${ JSON.stringify( logout_res, null, 4 ) }` )
        
        cookies.set( 'des_token', "", { path: '/' } )
        cookies.set( 'des_user', JSON.stringify( { logged_in: false } ), { path: '/' } )
        
        let user = await cookies.get( 'des_user' )
        console.log(`"\nFORM ACTION: logout -> LOGGED OUT! -> user\n${ user }`)
    }

}
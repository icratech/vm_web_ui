import { json } from '@sveltejs/kit'
import { debug } from "../../../lib/des_api"
    

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'

export async function POST( { request } ) {

    let r = await request.json( )
    debug( "request data:", r )
    const pdfDoc = await PDFDocument.create( )
    const timesRomanFont = await pdfDoc.embedFont( StandardFonts.TimesRoman )
    const page = pdfDoc.addPage( )
    const { width, height } = page.getSize( )
    const fontSize = 30
    page.drawText( r.rep_title, { 
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
        font: timesRomanFont,
        color: rgb( .2, .2, .2 ),
    } ) 
    const pdfBytes = await pdfDoc.save( )

    debug( "PDF file size: ", pdfBytes.length )
    
    fs.mkdir( './tmp/reports', { recursive: true }, ( err ) => {
        if ( err ) throw err;
    } )
    fs.writeFile( `./tmp/reports/${ r.rep_title }.pdf`, pdfBytes, 
    { encoding: "utf8",  flag: "w",  mode: 0o666 },
    ( err ) => { 
        if ( err )  debug( "Error writing file: ", err )
        else  debug( "File written successfully; PDF file size: ", pdfBytes.length ) 
    } )

    return json(pdfBytes)
    // return  json('whatever') 
}
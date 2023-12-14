
import { 
    PDFDocument, 
    PDFImage, 
    PageSizes, 
    StandardFonts, 
    degrees, 
    rgb 
} from 'pdf-lib'

export let PDF_RGB_BASE = {
    DARK: rgb( .16, .16, .16 ), 
    GREY: rgb( .39, .39, .39 ), 
    LIGHT: rgb( .90, .90, .90 ),
    RED: rgb( .7, 0, 0 ),
    ORANGE: rgb( .66, .32, 0 ), 
    YELLOW: rgb( .64, .5, .05 ), 
    GREEN: rgb( .15, .52, 0 ), 
    AQUA: rgb( .05, .41, .41 ), 
    BLUE: rgb( .03, .37, .71 ), 
    PURPLE: rgb( .35, .05, .61 ), 
    PINK: rgb( .64, .02, .46 )
}
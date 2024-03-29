/**
 * @class
 * @name DuOCADocument
 * @classdesc An Open Cel Animation document<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuOCA.load} to create an OCA object.
 * @property {string} ocaVersion - The version of OCA used to export this document
 * @property {string} name - The name of this project
 * @property {int} width - The width, in pixels
 * @property {int} height - The height, in pixels
 * @property {int} frameCount - The duration, in frames
 * @property {float} frameRate - The frame rate, in frames per second
 * @property {float} pixelAspect - The pixel aspect ratio
 * @property {OCALayer[]} layers - The layers
 * @property {int} startTime - The frame number at which the animation starts
 * @property {int} endTime - The frame number at which the animation ends
 * @property {DuOCA.colorDepths} colorDepth - Bits per channel used in the document
 * @property {float[]} backgroundColor - The background color
 * @property {string} originApp - The application name from which the document was exported.
 * @property {string} originAppVersion - The version of the origin application.
 * @property {Folder} folder - The folder containing the oca files.
 * @property {string} path - The URI to the folder containing the oca files.
 * @category DuOCA
 */

/**
 * @class
 * @name DuOCALayer
 * @classdesc An OCA Layer<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuOCA.load} to create an OCA object containing the layers.
 * @property {string} name - The layer name
 * @property {OCAFrame[]} frames - The keyframes of the animation for this layer.
 * @property {OCALayer[]} childLayers - The child layers if this layer is a group.
 * @property {DuOCA.LayerType} type - The type of the layer. See the Layer Types section below
 * @property {string} fileType -  The type of the files used for the frames. The file extension, without the initial dot.
 * @property {DuOCA.BlendingModes} blendingMode - The blending mode of the layer
 * @property {bool} inheritAlpha - The inherit alpaha option (preserve transparency)
 * @property {bool} animated - Whether this layer is a single frame or not.
 * @property {int[]} position - The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates. 
 * @property {int} width - The width, in pixels.
 * @property {int} height - The height, in pixels.
 * @property {int} label - A label for the layer.
 * @property {float} opacity - The opacity, in the range 0.0-1.0
 * @property {bool} visible - True if the layer is visible
 * @property {bool} reference - Whether the layer is a guide or reference, and should not be rendered.
 * @property {bool} passThrough - Whether the layer is in pass through mode. Only for grouplayer.
 * @category DuOCA
 */

 /**
 * @class
 * @name DuOCAFrame
 * @classdesc An OCA Frame<br />
 * This is not a real class, and cannot be instanciated.<br />
 * Use {@link DuOCA.load} to create an OCA object containing the layers.
 * @property {string} name - The layer name
 * @property {string} fileName - The path and name of the file of the frame. It is the absolute path from the root of the OCA folder.
 * @property {int} frameNumber - The frame in the document at which the frames starts to be visible
 * @property {float} opacity - The opacity, in the range 0.0-1.0
 * @property {int[]} position - The coordinates of the center of the layer, in pixels [X,Y] in the document coordinates.
 * @property {int} width - The width, in pixels.
 * @property {int} height - The height, in pixels.
 * @property {int} duration - The duration of the frame, in frames.
 * @category DuOCA
 */

/**
 * Open Cel Animation interchange tools
 * @namespace
 * @category DuOCA
 */
var DuOCA = {};

/**
    * The different layer types
    * @readonly
    * @enum {string}
    */
DuOCA.LayerType = {
    PAINT: 'paintlayer',
    VECTOR: 'vectorlayer',
    GROUP: 'grouplayer'
}


/**
 * Loads an OCA document from a json file
 * @param {File|string} file - The .json file or its path
 * @return {DuOCADocument|null} The OCA document or null if the file could not be parsed or opened
 */
DuOCA.load = function ( file )
{
    if (!DuDebug.checkVar( file, 'file', undefined, 'DuOCA.load(file)') !== true) return null;

    if ( typeof file === 'string' ) file = new File( file );

    if (!DuDebug.checkVar( file, 'file', 'File', 'DuOCA.load(file)') !== true) return null;
    
    if ( !file.exists ) throw "DuOCA.load(file): file does not exist.";

    var data = DuFile.parseJSON( file );

    //add containing folder
	data.folder = file.parent;
	data.path = data.folder.absoluteURI;

	return data;
}


/** Like an array, a collection associates a set of objects or values as a logical group and provides access to them by index. However, most collection objects are read-only. You do not assign objects to them yourself—their contents update automatically as objects are created or deleted. */
declare class Collection {
    /** The number of objects in the collection. */
    readonly length: number
  }

/** The ItemCollection object represents a collection of items. The ItemCollection belonging to a Project object contains all the Item objects for items in the project. The ItemCollection belonging to a FolderItem object contains all the Item objects for items in that folder. */
declare class ItemCollection extends Collection {
    /** Retrieves a Item object in the collection by its index number. The first object is at index 1. */
    readonly [index: number]: _ItemClasses
  }
  
/** The LayerCollection object represents a set of layers. The LayerCollection belonging to a CompItem object contains all the layer objects for layers in the composition. The methods of the collection object allow you to manipulate the layer list. */
declare class LayerCollection extends Collection {
    /** Retrieves a Layer object in the collection by its index number. The first object is at index 1. */
    readonly [index: number]: Layer
  }

/** The OMCollection contains all of the output modules in a render queue. The collection provides access to the OutputModule objects, but does not provide any additional functionality. The first OutputModule object in the collection is at index position 1. */
declare class OMCollection extends Collection {
    /** Retrieves a OutputModule object in the collection by its index number. The first object is at index 1. */
    readonly [index: number]: OutputModule
  }

/** The RQItemCollection contains all of the render-queue items in a project, as shown in the Render Queue panel of the project. The collection provides access to the RenderQueueItem objects, and allows you to create them from compositions. The first RenderQueueItem object in the collection is at index position 1. */
declare class RQItemCollection extends Collection {
    /** Retrieves an RenderQueueItem in the collection by its index number. The first object is at index 1. */
    [index: number]: RenderQueueItem
  }

declare enum RQItemStatus {
    DONE = 3019,
    ERR_STOPPED = 3018,
    NEEDS_OUTPUT = 3013,
    QUEUED = 3015,
    RENDERING = 3016,
    UNQUEUED = 3014,
    USER_STOPPED = 3017,
    WILL_CONTINUE = 3012,
}
  
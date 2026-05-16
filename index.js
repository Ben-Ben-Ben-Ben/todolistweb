const main = document.getElementById("MainRoot")
const rootCat = document.getElementById("CategoryRoot")

let currentWindowCount = 0
let createdObjects = []

let curDrag = null
let startPosX = null



/* logic for adding a new category window */
const butAddCategory = document.getElementById("AddCategory")
butAddCategory.addEventListener("click", function (ev) {
    const newCat = document.createElement("div")
    newCat.classList.add("CategoryContainer")
    generateCategoryHeader(newCat)

    /* draggable interactions*/
    newCat.draggable = true

    /* check if valid space to move the window */
    newCat.addEventListener("dragstart", function (e) {
        if (!document.elementFromPoint(e.x, e.y).classList.contains("DraggableComponent")) {
            e.preventDefault()
        }
    })

    newCat.addEventListener("dragover", function (e) {
        if (startPosX == null) {
            startPosX = e.x
        }
    })

    /* recalculate category position */
    newCat.addEventListener("dragend", function (e) {
        const rightMove = Math.sign((e.x - startPosX)) < 0
        if (document.elementFromPoint(e.x, e.y).closest("#CategoryRoot")) {
            let maxormin = Infinity
            let chosenElement = newCat
            createdObjects.forEach((node, _) => {
                let rect = node.getBoundingClientRect()

                if (rightMove) { /* ended to the right */
                    if (e.x <= rect.right && rect.right <= maxormin) { /* lost an hour of my life... javascript doesnt support chained comparisons*/
                        maxormin = rect.right
                        chosenElement = node
                    }
                } else { /* ended to the left */
                    if (maxormin == Infinity) {
                        maxormin = -Infinity
                    }
                    if (maxormin <= rect.left && rect.left <= e.x) { /* lost an hour of my life... javascript doesnt support chained comparisons*/
                        maxormin = rect.left
                        chosenElement = node
                    }
                }
            })

            if (rightMove) {
                chosenElement.parentElement.insertBefore(newCat, chosenElement)
            } else {
                chosenElement.parentElement.insertBefore(newCat, chosenElement.nextSibling)
            }



        } else {
            console.log("dropped elsewhere")
        }

        startPosX = null
    })

    createdObjects.push(newCat)
    rootCat.appendChild(newCat)

    /* change styling when objects are added */
    if (main.classList.contains("NoContent")) {
        main.classList.remove("NoContent")
        rootCat.classList.remove("disnone")
    }
})

/* clear all categories */
const butClearAll = document.getElementById("FullClear")
butClearAll.addEventListener("click", e => {
    rootCat.replaceChildren()
    createdObjects = []
    rootCat.classList.add("disnone")
    main.classList.add("NoContent")
})

/* generates the header for each category section */
function generateCategoryHeader(divNode) {
    const header = document.createElement("div")
    header.classList.add("CategoryTop")

    /* I really hope there is an easier less ugly way to do this :( */

    /* title */
    const cTitle = document.createElement("input")
    cTitle.value = "Untitled Category"
    cTitle.classList.add("TopItem")
    cTitle.classList.add("labelInner")
    header.appendChild(cTitle)

    /* buttons */
    const cButtons = document.createElement("span")
    cButtons.classList.add("TopItem")

    const butRemove = document.createElement("button")
    butRemove.innerText = "Remove"
    butRemove.addEventListener("click", OnRemove)
    butRemove.classList.add("CatButton")

    const butAdd = document.createElement("button")
    butAdd.innerText = "Add Item"
    butAdd.addEventListener("click", OnAddCheckboxItem)
    butAdd.classList.add("CatButton")

    const space = document.createElement("span")
    space.classList.add("DraggableComponent")
    space.innerText = "<->"

    /* reparenting everything */
    cButtons.appendChild(butRemove)
    cButtons.appendChild(butAdd)
    cButtons.appendChild(space)

    header.appendChild(cButtons)

    divNode.appendChild(header)
}

function generateTask(divNode) {
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"

    const taskTitle = document.createElement("input")
    taskTitle.value = "Unnamed Task"

    const butDelete = document.createElement("button")
    butDelete.innerText = "Delete"
    butDelete.addEventListener("click", function () {
        this.parentElement.remove()
    })

    divNode.appendChild(checkbox)
    divNode.appendChild(taskTitle)
    divNode.appendChild(butDelete)

    taskTitle.focus()
    console.log("supposedly focused")
}

/* stops mouse from displaying the 'invalid drop' cursor */
rootCat.addEventListener("dragover", function (e) {
    e.preventDefault()
})

/*
* Event Handlers
*/

function OnAddCheckboxItem(e) {
    const newNode = document.createElement("div")
    newNode.classList.add("TaskItem")
    generateTask(newNode)

    this.parentElement.parentElement.parentElement.appendChild(newNode)
}

/* removes a to-do list category */
function OnRemove(e) {
    this.parentElement.parentElement.parentElement.remove()
    let index = createdObjects.findIndex((val, _) => val == this.parentElement.parentElement.parentElement)
    createdObjects.splice(index, 1)

    if (createdObjects.length == 0) {
        main.classList.add("NoContent")
        rootCat.classList.add("disnone")
    }
}
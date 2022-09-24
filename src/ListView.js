import './ListView.css';
import LineList from './LineList.js';
import {Fragment, useState} from 'react';
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import { collection, query, setDoc, doc, updateDoc, deleteDoc, orderBy} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";


function ListView(props) {

    // state data to be used later
    const [selected, setSelected] = useState([]);
    const [edited, setEdited] = useState(-1);
    const [hidden, setHidden] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showPriorities, setShowPriorities] = useState(false);
    const [sort, setSort] = useState("creationAsc");
    const [sortOptions, setSortOptions] = useState(false);
    let showDeleteButton = selected.length > 0;
    let disableChecks = (edited !== -1);

    // Sorts note based on the type of sort selected
    const collectionDefault = collection(props.db, props.collection, props.listId, "Notes");
    function collectionSelector() {
        if (sort === "creationDesc") {
            return (query(collectionDefault,  orderBy("created", "desc")))
        } else if (sort === "textAsc") {
            return (query(collectionDefault, orderBy("text", "asc")))
        } else if (sort === "textDesc") {
            return (query(collectionDefault, orderBy("text", "desc")))
        } else if (sort === "priorityAsc") {
            return (query(collectionDefault, orderBy("priority", "asc")))
        } else if (sort === "priorityDesc") {
            return (query(collectionDefault, orderBy("priority", "desc")))
        } else{
            return(query(collectionDefault))
        }
    }
    const [list,loading,error] = useCollectionData(collectionSelector());

    if (error) {
        console.log("ERROR: List data failed to load from Firestore")
    }

    // Stores if someone is only a viewer
    let canOnlyView = props.canView.includes(props.user.email) && !props.canEdit.includes(props.user.email);

    // Buttons begin as hidden but are displayed depending on the list length
    let showHideButton = false;
    let showSortButton = false;
    if (!loading) {
        showHideButton = list.filter(p => p.checked).length > 0;
        showSortButton = list.length > 1;
    }

    function handleLineEdited(lineID) {
        // if we're editing the bottommost 'Tap to Add Note' line and the text has changed, update our data/state
        if (lineID !== -2 && document.getElementById('tempTapLine').value!=="") {
                handleItemAdded(document.getElementById('tempTapLine').value);
            document.getElementById('tempTapLine').value=""
        }
        setEdited(lineID) // update edited line state
    }

    // changes line data for textboxes, checkboxes, or special key presses
    function handleItemChanged(itemID, field, newValue) {
        if (["text", "check_visible", "select_visible", "checked", "priority", "created"].includes(field)) {
            void updateDoc(doc(props.db, props.collection, props.listId, "Notes", itemID),
                {
                    [field]: newValue,
                })
        }
        // changes the active/"clicked on" element to body when enter is pressed
        if (field === 'Enter') {
            document.activeElement.blur();
        }
        // deletes line if backspace is pressed while line is empty
        if (field === 'Backspace') {
            if (newValue === "") {
                handleItemDeleted(itemID);
                if (selected.includes(itemID)) {
                    handleToggleSelectedLines(itemID);
                }
            }
        }
    }

    // controls whether the hide button should be showing
    function handleHideToggle() {
        setHidden(!hidden);
    }

    // deletes data from the list by filtering out selected keys
    function handleDelete() {
        selected.forEach(id => deleteDoc(doc(props.db, props.collection, props.listId, "Notes", id)));
        setSelected([]); // no selected items remain, so update that
        setShowWarning(false);
    }

    function handlePrioritySet(priority) {
        selected.forEach(id => updateDoc(doc(props.db, props.collection, props.listId, "Notes", id),{priority:priority}))
        setShowPriorities(false);
    }

    function changeSortOption(sortType) {
        setSort(sortType);
        setSortOptions(false);
    }

    function handleWarning() {
        setShowWarning(true);
    }

    function handlePriority() {
        setShowPriorities(true);
    }

    // changes display of selected lines by filtering selected lines
    function handleToggleSelectedLines(lineID) {
        if (selected.includes(lineID)) {
            setSelected(selected.filter((p) => p !== lineID))
        } else {
            setSelected([...selected, lineID])
        }
    }

    // deletes an item by filtering it out from the data
    function handleItemDeleted(itemID) {
        void deleteDoc(doc(props.db, props.collection, props.listId, "Notes", itemID));
    }

    // adds an item by generating an id and using the passed in text
    function handleItemAdded(textValue) {
        const lineId = generateUniqueID();
        void setDoc(doc(props.db, props.collection, props.listId, "Notes", lineId),
            {
                key: lineId,
                text: textValue,
                checked: false,
                created: 0,
                priority: 0,
                check_visible: true,
                text_visible: true,
                select_visible: true
            })
    }

    if (loading) {
        return <div id={"loadingScreen"}>Loading...
        </div>;
    }


    function tapLineType(e) {
        if (e.key=== 'Enter') {
            handleItemAdded(document.getElementById('tempTapLine').value);
            document.getElementById('tempTapLine').value="";
            document.activeElement.blur();
            setEdited(-1);
        }
    }
    // generates extra blank lines at the bottom of each list
    function getExtraLines() {
        let extraLines = [];
        for (let i = 0; i < 21; i++) {
            extraLines.push(<li className={"empty"} onClick={() => handleLineEdited(-1)}/>)
        }
        return extraLines
    }


    return (<Fragment>
        <div id="container">
            <div id={"top"} onClick={() => {
                handleLineEdited(-1)
            }}>
                <div id={"button-div"}>
                    <button className="back-button" aria-label={"return to home"}
                            tabIndex={(showWarning || showPriorities || sortOptions) ? -1 : 1}
                            onClick={() => (props.onListView(""))}>&larr;</button>
                    {showSortButton && <button className="sort-button"
                                               aria-label={"sort"}
                                               tabIndex={(showWarning || showPriorities || sortOptions) ? -1 : 2}
                                               onClick={() => setSortOptions(true)}>

                        {(sort === "textAsc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortText"}>A Z</div>
                        </div>}
                        {(sort === "textDesc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortText"}>Z A</div>
                        </div>}
                        {(sort === "creationAsc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortDate"}>
                                <div id={"date1"}>JAN</div>
                                <div id={"date2"}>DEC</div>
                            </div>
                        </div>}
                        {(sort === "creationDesc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortDate"}>
                                <div id={"date1"}>DEC</div>
                                <div id={"date2"}>JAN</div>
                            </div>
                        </div>}
                        {(sort === "priorityAsc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortText"}>1 3</div>
                        </div>}
                        {(sort === "priorityDesc") && <div className={"sort-button-display"}>
                            <div id={"sortArrow"}>&darr;</div>
                            <div id={"sortText"}>3 1</div>
                        </div>}
                    </button>}
                </div>

            </div>

            <div id={"title"}><h2 onClick={() => {
                handleLineEdited(-1)
            }}>{props.title}</h2></div>
            <div id={"lineList"} onClick={() => {
                handleLineEdited(-1)
            }}>
                <LineList lineList={list}
                          canOnlyView={canOnlyView}
                          selectedLines={selected}
                          hideChecks={hidden}
                          showDeleteButton={showDeleteButton}
                          showHideButton={showHideButton}
                          disableChecks={disableChecks}
                          onHideToggle={handleHideToggle}
                          onToggleSelected={handleToggleSelectedLines}
                          onItemChanged={handleItemChanged}
                          onItemDeleted={handleItemDeleted}
                          onTrash={handleWarning}
                          onPriority={handlePriority}
                          onEdited={handleLineEdited}
                          warning={(showWarning || showPriorities || sortOptions)}
                />
            </div>
            {showWarning && <div className={"popup"}>
                <div id={"back"} onClick={() => setShowWarning(false)}/>
                <div id={"warning"}>
                    <div>
                        The selected items will be <font color={"red"}>permanently deleted</font>.
                        Are you sure you want to delete these items?
                    </div>
                    <div id={"warningButtons"}>
                        <button id={"no"} className={"warningOption"} tabIndex={0}
                                onClick={() => setShowWarning(false)}>No, Go Back
                        </button>
                        <button id={"yes"} className={"warningOption"} tabIndex={0} onClick={handleDelete}>Yes, Delete
                        </button>
                    </div>
                </div>
            </div>}
            {showPriorities && <div className={"popup"}>
                <div id={"back"} onClick={() => setShowPriorities(false)}/>
                <div id={"warning"}>
                    <div id={"priorityMessage"}> Set priority value for selected items.</div>
                    <div id={"priorityButtons"}>
                        <button id={"priorityZero"} className={"warningOption"} tabIndex={0}
                                onClick={() => handlePrioritySet(0)}>Remove Priority
                        </button>
                        <button id={"priorityOne"} className={"warningOption"} tabIndex={0}
                                onClick={() => handlePrioritySet(1)}>1
                        </button>
                        <button id={"priorityTwo"} className={"warningOption"} tabIndex={0}
                                onClick={() => handlePrioritySet(2)}>2
                        </button>
                        <button id={"priorityThree"} className={"warningOption"} tabIndex={0}
                                onClick={() => handlePrioritySet(3)}>3
                        </button>

                    </div>
                </div>
            </div>}
            {sortOptions && <div className={"popup"}>
                <div id={"back"} onClick={() => setSortOptions(false)}/>
                <div id={"warning"}>
                    <div id={"priorityMessage"}> Choose a sorting option.</div>
                    <div id={"sortOptions"}>
                        <button id={"creationAscButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("creationAsc")}> Oldest to Newest
                        </button>
                        <button id={"creationDescButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("creationDesc")}>Newest to Oldest
                        </button>
                        <button id={"textAscButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("textAsc")}>Alphabetical
                        </button>
                        <button id={"textDescButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("textDesc")}>Rev. Alphabetical
                        </button>
                        <button id={"priorityDescButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("priorityAsc")}>Priority (Low to High)
                        </button>
                        <button id={"priorityAscButton"} className={"warningOption"} tabIndex={0}
                                onClick={() => changeSortOption("priorityDesc")}>Priority (High to Low)
                        </button>
                    </div>
                </div>
            </div>}
            <ul id={"endList"} tabIndex={-1} aria-label={"Tap to Add Note Line"}>
                <li id={"tapLine"} tabIndex={-1}>
                    <input id={"tempTapLine"}
                           disabled={canOnlyView}
                           className={"tempTapClass"}
                           type={"text"}
                           autoComplete={"off"}
                           aria-label={"Type to Add Note line"}
                           tabIndex={(showWarning || showPriorities || sortOptions) ? -1 : 3}
                           onClick={() => setEdited(-2)}
                           onChange={() => setEdited(-2)}
                           onKeyDown={(e) => tapLineType(e)}
                           defaultValue={""}
                    />
                    <div className={document.activeElement.id !== 'tempTapLine' ? "inactiveText" : "activeText"}
                         tabIndex={-1}>Tap to Add Note
                    </div>
                </li>
                {getExtraLines()}
            </ul>
            <div id={"bottom"} onClick={() => {
                handleLineEdited(-1)
            }}/>
        </div>
    </Fragment>);
}

export default ListView;

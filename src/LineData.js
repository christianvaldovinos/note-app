import "./LineData.css";

import {Fragment} from "react";

function LineData(props) {
    // lists that help us assign specific CSS classes to elements based on state
    const checkClasses = ["checkboxes "];
    const textClasses = ["textboxes "];
    const selectClasses = ["select-button "];
    const itemClasses = [];

    // hides line if hide button is clicked and item is completed
    const hideLine = props.hideChecks && props.line.checked;

    // display of lines is altered by pushing classes based on the values of the line fields
    if (props.line.checked) {
        textClasses.push("checked ");
    }
    if (!props.line.text_visible) {
        textClasses.push("hidden ");
    }
    if (!props.line.check_visible) {
        checkClasses.push("hidden ");
    }
    if (!props.line.select_visible)  {
        selectClasses.push("hidden ");
    }
    if (props.disableChecks) {
        checkClasses.push("disabled ");
    }
    if (props.selected) {
        textClasses.push("selected ");
        itemClasses.push("selected ");
    } else {
        textClasses.push("normal ");
    }

    // updates the values which indicate which line we have clicked on
    function clickTextWrapper(e, key) {
        e.stopPropagation();
        props.onEdited(key);
    }

    // updates the value of a checkbox when we click on it
    function changeCheckWrapper(e, key) {
        props.onEdited(-1);
        props.onItemChanged(key,"checked", props.line.checked ? !props.line.checked : {} )
    }

    return (<Fragment>
            {!hideLine && <div>
                <li className={itemClasses.join(" ")}>
                    <button className={selectClasses.join(" ")}
                            tabIndex={props.warning ? -1 : 0}
                            aria-label={props.text + " line select, priority level " + props.priority}
                            onClick={() => props.onToggleSelected(props.line.key)}>
                        {props.anySelected && !!props.priority &&
                            <span className={"selectButtonText"}>
                                {props.priority}
                            </span>}
                    </button>
                    {props.checked && <input type={"checkbox"}
                                             disabled={props.canOnlyView}
                                             tabIndex={(props.warning || props.canOnlyView) ? -1 : 0}
                                             className={checkClasses.join(" ")}
                                             aria-label={props.text}
                                             onChange={(e) => changeCheckWrapper(e, props.line.key)} checked/>}
                    {!props.checked && <input type={"checkbox"}
                                              disabled={props.canOnlyView}
                                              tabIndex={(props.warning || props.canOnlyView) ? -1 : 0}
                                              className={checkClasses.join(" ")}
                                              aria-label={props.text}
                                              onChange={(e) => changeCheckWrapper(e, props.line.key)}/>}
                    <div id={"textboxDiv"}>
                        <input type={"text"}
                               className={textClasses.join(" ")}
                               disabled={props.canOnlyView}
                               onClick={(e) => clickTextWrapper(e, props.line.key)}
                               tabIndex={(props.warning || props.canOnlyView) ? -1 : 0}
                               onChange={(e) => props.onItemChanged(props.line.key, "text", e.target.value)}
                               onKeyDown={(e) =>
                                       {if (e.key === 'Enter') {
                                           props.onItemChanged(props.line.key, e.key, props.text);
                                           props.onEdited(props.line.key);
                                       } if (e.key === 'Backspace') {
                                           props.onItemChanged(props.line.key, e.key, props.text);
                                       }}}
                               value={props.text}
                               id={props.line.key}/>
                    </div>
                </li>
            </div>}
    </Fragment>)
}

export default LineData;
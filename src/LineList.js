import './LineList.css';
import LineData from './LineData.js';
import {Fragment} from "react";

function LineList(props) {
    let hideClass;

    // updates the image on the hide button
    if (props.hideChecks) {
        hideClass = "open";
    } else {
        hideClass = "closed";
    }

    return(
        <Fragment>
            <ul type={"none"}>
                {props.lineList.map((data) =>
                    <LineData disableChecks={props.disableChecks}
                              hideChecks={props.hideChecks}
                              selected={props.selectedLines.includes(data.key)}
                              anySelected={props.selectedLines.length > 0}
                              line={data}
                              key={data.key}
                              text={data.text}
                              clicked={data.clicked}
                              checked={data.checked}
                              priority={data.priority}
                              onItemChanged={props.onItemChanged}
                              onItemDeleted={props.onItemDeleted}
                              onEdited={props.onEdited}
                              onToggleSelected={props.onToggleSelected}
                              warning={props.warning}
                              canOnlyView = {props.canOnlyView}
                    />)}
            </ul>

            {/*displays our trash/"Delete" button*/}
            <div id={"lower-left-buttons"}>
            {props.showDeleteButton && !props.canOnlyView && <div><button className={"priority"}
                                                    aria-label={"set priority for selected lines"}
                                                    tabIndex={props.warning ? -1 : 0}
                                                    onClick={props.onPriority}>
                                                &#128290;
                                            </button>
                                            <button className={"trashButton"}
                                                    aria-label={"delete selected lines"}
                                                    tabIndex={props.warning ? -1 : 0}
                                                    onClick={props.onTrash}>
                                                &#128465;
                                            </button>
                                        </div>}

            {/*displays our show/hide completed items button */}
            {props.showHideButton && !props.canOnlyView &&
                <button id="eyeButton" tabIndex={props.warning ? -1 : 0}
                        className={"circleButton"}
                        aria-label={props.hideChecks ? "show completed tasks" : "hide completed tasks"}
                        onClick={props.onHideToggle}>
                    <div id={"eyeImgDiv"}>
                        <img id="eye" className={hideClass} alt={""}/>
                    </div>
                </button>}
            </div>
        </Fragment>
    )
}

export default LineList;
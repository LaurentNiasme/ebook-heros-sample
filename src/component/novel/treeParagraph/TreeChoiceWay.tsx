import React, {useEffect, useState, ChangeEvent, MouseEvent} from 'react';
import { edithChoiceWayParaLink,selectedLinkChoiceWayPara, handleNewTextQuestParaWay, saveChoiceWayLink, addNewLink, clearLinkChoiceWayUsed,fetchLoadLinkChoiceWay } from '@/store/novelSlice';
import {useAppDispatch, useAppSelector} from '@/store/hookStore';
import styleTreeParagraph from '@/styles/treeParagraph.module.scss';
import TreeContainerParagraphWay from '@/component/novel/treeParagraph/TreeContainerParagraphWay';
import TreeCreateChoiceWay from '@/component/novel/treeParagraph/TreeCreateChoiceWay';
import TreeContainerChoiceWay from '@/component/novel/treeParagraph/TreeContainerChoiceWay';
import TreeSelectParagraph from '@/component/novel/treeParagraph/TreeSelectParagraph';
import sytleBouton from '@/styles/bouton.module.scss';
import WayParagraph from './WayParagraph';

export interface TreeChoiceWayProps {
    data : {
        id:number|null,
        firstLink:boolean,
        idParent:number|null,
        idPlaceInChoice:number,
        textTitleNewWay:string,
        textIntroduceNewWay:string,
        questionNewWay : {
            idParagraphNextWay : number,
            txtChoiceNewWay:string
        }[]
    },
    dataPlace:number
}

export interface dataParaWay {
    wayParagraph: {
        idNovel: number;
        id: number;
        beginWay: boolean;
        titleParagraphWay: string;
        idParagraph: number[];
        idPreviousWay: number | null;
        idNextWay: number | null;
        choiceNewWay: {
            textNewWay: string;
            questionNewWay: {
                idNextWay : number,
                txtQuestionNewWay:string
            }[];
        } | null;
    }|null
}




function TreeChoiceWay ({data,dataPlace}:TreeChoiceWayProps) {
    const dataTree = useAppSelector(data=> data.novelData);
    const dispatch = useAppDispatch();
    const [myDataParaWay, setMyDataParaway] = useState<dataParaWay>();
    const [edithParaChoiceWay, setEdithParaChoiceWay] = useState<boolean>(false);
    const [icoEdith, seticoEdith] = useState<string>("Edit");
    const [edithDisabled, setEdithiDIsabled] = useState<boolean>(false);
    const [addDisabled, setAddDisabled] = useState<boolean>(false);
    const [classContainerInputParaWay, setClassContainerInputParaWay] = useState<string>(`${styleTreeParagraph.containInputParaWay}`)
    const [classBtnEdith, setClassBtnEdith] = useState<string>(`${styleTreeParagraph.boutonEdith}`)

// crétation des branches de choix
    function createNextChoiceWay () {
        const findNextChoice =  dataTree.allLinkChoiceWay.filter(choiceWay => choiceWay.idParent && choiceWay.idParent === data.id && choiceWay.idPlaceInChoice===dataPlace)
        return (
         <>
           { findNextChoice[0] ? <TreeContainerChoiceWay data={findNextChoice[0]}/> : null}
         </>
        )
    }
   
    function createLineLink () {
        if(dataPlace===0){
            return (
                <>
                    <div className = {styleTreeParagraph.lineTree}>
                    </div>
                    <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeLeft}`} >
                    </div>
                </>
            )
        }if (dataPlace===data.questionNewWay.length-1) {
            return (
                <>
                    <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeRight}`} >
                    </div>
                    <div className = {styleTreeParagraph.lineTree}>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeRight}`} >
                    </div>
                    <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeLeft}`} >
                    </div>
                </>
            )
            
        }
    }
   async function edithParaWay () {
        if(dataTree.edithLink.edithChoiceWayParaLink){
            dispatch(edithChoiceWayParaLink(false))
            setEdithParaChoiceWay(false)
            seticoEdith('Edit')
            setClassContainerInputParaWay(`${styleTreeParagraph.containInputParaWay}`)
            setClassBtnEdith(`${styleTreeParagraph.boutonEdith}`)
            // on envoie dans redux state tout ce qu'il y a dans le linkChoice
            if(dataTree.linkChoiceWayUsed.dataLink){
                const newDataLink = {...dataTree.linkChoiceWayUsed.dataLink}
                await dispatch(saveChoiceWayLink({dataLink:{newDataLink}}))
                await dispatch(clearLinkChoiceWayUsed())
                dispatch(fetchLoadLinkChoiceWay())
            }
        }else{
            const dataLink= {...data}
            const dataParaChoice = {
                placeChoice:dataPlace
            }
            await dispatch(selectedLinkChoiceWayPara({dataLink, dataParaChoice}))
            dispatch(edithChoiceWayParaLink(true))
            setEdithParaChoiceWay(true)
            seticoEdith('Save')
            setClassContainerInputParaWay(`${styleTreeParagraph.selectedInputParaWay}`)
            setClassBtnEdith(`${styleTreeParagraph.boutonSave}`)
        }
    }

    function showQuestChoice () {
        if (dataPlace!=null){
            return data.questionNewWay[dataPlace].txtChoiceNewWay
        }else{
            null
        }
    }

    function showEditQuestChoice() {
      
        if (dataTree.linkChoiceWayUsed.dataLink && dataPlace !=null){
            const textQuestChoice = dataTree.linkChoiceWayUsed.dataLink.questionNewWay[dataPlace].txtChoiceNewWay
            return <input type='text'name='titleWayParagraph' onChange={e=>handleTxtTitle(e)} value={textQuestChoice}/>
        }else{
            return "nothing"
        }
    }

    function handleTxtTitle (e:ChangeEvent<HTMLInputElement>) {
        const dataText = {
            txtQuestChoiceNewWay:e.target.value,
            placeParaWay:dataPlace
        }
        dispatch(handleNewTextQuestParaWay({...dataText}))
    }
// nom du paragraph way selectionné
    function showParaWayChosed () {
        return  myDataParaWay && myDataParaWay.wayParagraph? myDataParaWay.wayParagraph.titleParagraphWay : ""
    };
    
    function edithParaWayChosed () {
        return (
            <TreeSelectParagraph data={data} dataPlace={dataPlace}/>
        )
    };

    function addChoiceWayLink () {
                // dispatch(opcModalNewWayParagraph({open:true, startWay:true}))
                const dataLink = {
                    id:null,
                    firstLink:false,
                    idParent:data.id,
                    idPlaceInChoice:dataPlace,
                    textTitleNewWay:"",
                    textIntroduceNewWay:"",
                    questionNewWay : [ ]
               }
               const dataParaChoice = {
                   placeChoice :dataPlace,
               }
                dispatch(addNewLink({dataLink, dataParaChoice}))
    }
// trouver le paragraph qu'on a selectionné
    useEffect(()=>{
        const findParaWay =  dataTree.allWayParagraph.filter(wayParagraph => {
            if (dataPlace!=null &&  data.questionNewWay[dataPlace].idParagraphNextWay=== wayParagraph.id){
                
                 return wayParagraph
            }
        })
        const wayParagraph = {...findParaWay[0]}
        setMyDataParaway({wayParagraph})
    },[]);

//  voir si on est en mode edition paraLink et si c est bien nous
    useEffect(()=>{
        if (dataTree.edithLink.edithChoiceWayParaLink && dataTree.linkChoiceWayUsed.dataLink){
            if(dataTree.linkChoiceWayUsed.dataLink.id===data.id&&dataTree.linkChoiceWayUsed.dataParaChoice.placeChoice===dataPlace){
                setAddDisabled(true)
            }else{
                setEdithiDIsabled(true)
                setAddDisabled(true)
            }
        }else{
            setEdithiDIsabled(false)
            setAddDisabled(false)
        }
    },[dataTree.edithLink.edithChoiceWayParaLink])

// voir si on est en mode edition choiceWay
    useEffect(()=>{
       if(dataTree.edithLink.edithChoiceWayLink){
        setEdithiDIsabled(true)
        setAddDisabled(true)
       } else{
            setEdithiDIsabled(false)
            setAddDisabled(false)
       }
    },[dataTree.edithLink.edithChoiceWayLink])

// si on est un nouveau choix entrer directement en edition
    useEffect(()=>{
        if(dataPlace===dataTree.linkChoiceWayUsed.dataParaChoice.placeChoice){
            edithParaWay()
        }
    },[])
    return(
        <div className={styleTreeParagraph.TreeChoiceWay}>
            <div className={styleTreeParagraph.containLineTree}>
                {createLineLink()}
            </div>
            <div className={classContainerInputParaWay}>
                <div className = {styleTreeParagraph.editParaWay}>
                    <input className={classBtnEdith} type="button" value={icoEdith} onClick={edithParaWay} disabled={edithDisabled}/>
                </div>
                <div className = {styleTreeParagraph.questChoiceWayContain}>
                    <label>Voulez vous : </label>
                    <div className={styleTreeParagraph.questChoiceWay}>
                        { edithParaChoiceWay? showEditQuestChoice() : showQuestChoice()}
                    </div>
                </div>
                <div className={styleTreeParagraph.zoneParagraphWay}>
                    <label>Suivre le chemin : </label>
                    <div className={styleTreeParagraph.paragraphWay}>
                        { edithParaChoiceWay? edithParaWayChosed() : showParaWayChosed()}
                    </div>
                </div>
                <div className = {styleTreeParagraph.zoneBtnAddChoiceWayLink}>
                    <input className={styleTreeParagraph.boutonAdd} type="button" value="Proposition de choix" onClick={addChoiceWayLink} disabled={addDisabled}/>
                </div>
            </div>
            <div className={styleTreeParagraph.zoneChoiceInWay}>
                {createNextChoiceWay()}
            </div>
        </div>
    )
}

export default TreeChoiceWay
import React, {useEffect, useState, ChangeEvent, MouseEvent} from 'react';
import { edithChoiceWayLink, handleTitleChoiceLink, handleTextIntroChoiceLink, saveChoiceWayLink, selectedLinkChoiceWayPara, addChoiceWayLink, clearLinkChoiceWayUsed, fetchLoadLinkChoiceWay } from '@/store/novelSlice';
import {useAppDispatch, useAppSelector} from '@/store/hookStore';
import styleTreeParagraph from '@/styles/treeParagraph.module.scss';
import sytleBouton from '@/styles/bouton.module.scss';
import TreeChoiceWay from '@/component/novel/treeParagraph/TreeChoiceWay';

export interface TreeCreateChoiceWayProps {
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
    }
}

export interface dataCreateItf {
    dataCreate : {
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
    }
}

function TreeCreateChoiceWay ({data}:TreeCreateChoiceWayProps) {

    const dataTree = useAppSelector(data=> data.novelData);
    const dispatch = useAppDispatch();
    const [edithChoiceWay, setEdithChoiceWay] = useState<boolean>(false);
    const [icoEdith, setEcoEdith] = useState<string>("Edit");
    const [newChoiceLink, setNewChoiceLink] = useState<boolean>(false);
    const [edithDisabled, setEdithiDisabled] = useState<boolean>(false);
    const [addDisabled, setAddDisabled] = useState<boolean>(false);
    const [classCreateZoneText, setClassCreateZoneText] = useState<string>(`${styleTreeParagraph.treeCreateZoneTexte}`)
    const [classBtnEdith, setClassBtnEdith] = useState<string>(`${styleTreeParagraph.boutonEdith}`)

    function createTreeChoiceWay (newChoiceLink:boolean) {
        
        if (newChoiceLink){
            console.log(data, " : data create")
            if(dataTree.linkChoiceWayUsed.dataLink){
                return (
                    <>
                        {
                               dataTree.linkChoiceWayUsed.dataLink.questionNewWay.map((question, index) => {
                                if(dataTree.linkChoiceWayUsed.dataLink!=null){
                                    return(
                                        <>
                                            <TreeChoiceWay data={dataTree.linkChoiceWayUsed.dataLink} dataPlace={index}/>
                                        </>
                                )
                                }
                            })
                        }
                    </>
                )
            }
            
        }else{
            return (
                <>
                    {
                           data.questionNewWay.map((question, index) => {
                            return(
                                <>
                                    <TreeChoiceWay data={data} dataPlace={index}/>
                                </>
                            )
                        })
                    }
                </>
            )
        }
    };

    async function launchEdithChoiceWayLink () {

        // si on est en mode édition on sauvegarde et on disable le mode édition
        if(dataTree.edithLink.edithChoiceWayLink){
            dispatch(edithChoiceWayLink(false))
            setEdithChoiceWay(false)
            setEcoEdith('Edit')
            setClassCreateZoneText(`${styleTreeParagraph.treeCreateZoneTexte}`)
            setClassBtnEdith(`${styleTreeParagraph.boutonEdith}`)
            // on envoie dans redux state tout ce qu'il y a dans le linkChoice
            if(dataTree.linkChoiceWayUsed.dataLink){
                const newDataLink = {...dataTree.linkChoiceWayUsed.dataLink}
                await dispatch(saveChoiceWayLink({dataLink:{newDataLink}}))
                await dispatch(clearLinkChoiceWayUsed())
                dispatch(fetchLoadLinkChoiceWay())
            }
            
        //si on n'est pas en mode edition    
        }else{
            const dataLink= {...data}
            const dataParaChoice = {
                                    placeChoice:data.idPlaceInChoice
                                }
            dispatch(selectedLinkChoiceWayPara({dataLink, dataParaChoice}))
            dispatch(edithChoiceWayLink(true))
            setEdithChoiceWay(true)
            setEcoEdith('Save')
            setClassCreateZoneText(`${styleTreeParagraph.selectedBorder}`)
            setClassBtnEdith(`${styleTreeParagraph.boutonSave}`)
        }
    };

    function showEditIntroChoice () {
        if(dataTree.linkChoiceWayUsed.dataLink){

            const textIntro = dataTree.linkChoiceWayUsed.dataLink.textIntroduceNewWay
            // return <input type='text'name='titleWayParagraph' onChange={e=>handleTextIntro(e)} value={textIntro}/>
            return (
                
                <textarea  className = {styleTreeParagraph.txtAreaintro} onChange={(e)=> handleTextIntro(e)} value={textIntro}/>
            )
        }
    };
    
    function handleTextIntro (e:ChangeEvent<HTMLTextAreaElement>) {
        dispatch(handleTextIntroChoiceLink(e.target.value))
    };

    function showIntroChoice () {
        return (
            <>
                {data.textIntroduceNewWay}
            </>
        )
    };

    function showTitleChoiceWay () {
        return(
            <>
                 {data.textTitleNewWay}
            </>
        )
    }

    function showEditTitleChoiceWay () {
        
        if(dataTree.linkChoiceWayUsed.dataLink){
            const textTitle = dataTree.linkChoiceWayUsed.dataLink.textTitleNewWay
            return <input type='text'name='titleWayParagraph' onChange={e=>handleTxtTitle(e)} value={textTitle}/>
        }
    }
    function handleTxtTitle (e:ChangeEvent<HTMLInputElement>) {
        dispatch(handleTitleChoiceLink(e.target.value))
    }

   async function selectLinkChoiceWay () {
        const dataLink= {...data}
        const dataParaChoice = {
                                placeChoice:data.idPlaceInChoice
                            }
        await dispatch(selectedLinkChoiceWayPara({dataLink, dataParaChoice}))
   }

    async function addChoiceWayParaLink () {

        await(selectLinkChoiceWay())
        dispatch(addChoiceWayLink())
        
    }

    // useEffect(()=>{
    //     setEdithChoiceWay(dataTree.edithLink.edithChoiceWayLink)
    // },[dataTree.edithLink.edithChoiceWayLink])

    useEffect(()=>{
        console.log(data, "data new choice way link")
        if (data.id===null){
            // launchEdithChoiceWayLink()
            console.log(dataTree.edithLink.edithChoiceWayLink, " : ouvert ou fermé")
        }
    },[])

// use effect quand edithChoicWayLink de redux change, voir si c'est notre choiceWayLink qui est en mode Edit
    useEffect(()=>{
        if (dataTree.linkChoiceWayUsed.dataLink && dataTree.edithLink.edithChoiceWayLink){
            if(dataTree.linkChoiceWayUsed.dataLink.id===data.id ){
                // setEdithChoiceWay(dataTree.edithLink.edithChoiceWayLink)
                setEdithiDisabled(false)
                setAddDisabled(true)
            }else{
                setEdithiDisabled(true)
                setAddDisabled(true)
            }
        }else{
            setEdithiDisabled(false)
            setAddDisabled(false)
        }
    },[dataTree.edithLink.edithChoiceWayLink])

    //  voir si on est en mode edition paraLink on bloque les boutons
    useEffect(()=>{
            if(dataTree.edithLink.edithChoiceWayParaLink){
                setEdithiDisabled(true)
                setAddDisabled(true)
            }else{
                setEdithiDisabled(false)
                setAddDisabled(false)
                
            }
        
    },[dataTree.edithLink.edithChoiceWayParaLink])

// use effect on ajouté un nouveau choix 
    useEffect(()=>{
        if(dataTree.linkChoiceWayUsed.dataLink&& dataTree.linkChoiceWayUsed.dataLink.id===data.id){
            console.log(dataTree.linkChoiceWayUsed.dataLink.questionNewWay)
            setNewChoiceLink(true)
        }else{
            setNewChoiceLink(false)
        }
    },[dataTree.linkChoiceWayUsed.dataLink? dataTree.linkChoiceWayUsed.dataLink.questionNewWay: null])

    useEffect(()=>{
        // createTreeChoiceWay(newChoiceLink)
       
    },[])
 

    return(
        <div className={styleTreeParagraph.treeCreateChoiceWay}>
            <div className={classCreateZoneText}>    
                <div className = {styleTreeParagraph.zoneBtnEdit}>
                    <input className={classBtnEdith} type="button" value={icoEdith} onClick={launchEdithChoiceWayLink} disabled={edithDisabled}/>
                </div>
                <div className={styleTreeParagraph.titleLinkChoiceWayContain}>
                  <label className={styleTreeParagraph.title}>Titre du liens</label> 
                  <div className={styleTreeParagraph.titleLinkChoiceWay}>
                    {edithChoiceWay? showEditTitleChoiceWay() : showTitleChoiceWay()}
                  </div>
                </div>
                <div className={styleTreeParagraph.textIntroChoiceWayContain}>
                <label className={styleTreeParagraph.title}>texte introduction</label> 
                <div className={styleTreeParagraph.textIntroChoiceWay}>
                    {edithChoiceWay? showEditIntroChoice() : showIntroChoice()}
                </div>
                </div>
                <div className = {styleTreeParagraph.zoneBtnAddChoiceWayLink}>
                    <input className={styleTreeParagraph.boutonNew} type="button" value="Création nouveau choix" onClick={addChoiceWayParaLink} disabled={addDisabled}/>
                </div>
            </div>
            <div className={styleTreeParagraph.containLineTree}>
                <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeMidleRight}`} >
                </div>
                <div className = {`${styleTreeParagraph.lineTree} ${styleTreeParagraph.lineTreeMidleLeft}`} >
                </div>
            </div>
        
            <div className={styleTreeParagraph.containerChoiceWay}>
                {createTreeChoiceWay(newChoiceLink)}
            </div>
          
        </div>
    )
}

export default TreeCreateChoiceWay
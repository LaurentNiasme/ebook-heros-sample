import React, {useEffect, useState, ChangeEvent} from 'react';
import Modal from 'react-modal';
import {  opcModalNewWayParagraph, addNewParagraphInWay, titleParagraphWay, saveWayParagraph,addNewChoiceInWay, createChoiceWay } from '@/store/novelSlice';
import {useAppDispatch, useAppSelector} from '@/store/hookStore';
import SelectParagraphWay from '@/component/novel/treeParagraph/SelectParagraphWay';
import styleModalWayPara from '@/styles/modalWayParagraph.module.scss';
import sytleBouton from '@/styles/bouton.module.scss';
import ZoneChoiceWay from '@/component/novel/treeParagraph/ZoneChoiceWay';

// Container, modal pour créer les nouveaux chemins de paragraph
const ModalNewWay = () => {
    const dispatch = useAppDispatch();
    const dataWayParagraph = useAppSelector(state=>state.novelData)

    const [titleParagraph, setTitleNewParagraph] = useState<string>('');
    const [txtBtnNewWay, setTxtBtnNewWay] = useState<string>('');
    const [idParagraph, setIdParagraph] = useState<number[]>([]);
    const [textParagraph, setTextParagraph] = useState<string>('');
    const [indexSelect, setIndexSelect] = useState<{idSelect:number, idOptionSelect:number, idParagraphSelect:number}[]|null>(null);
    
    // objet style de la modal
    const data = {    idSelect:1,idParagraphSelect:1,}
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)',
              width : '500px',
              height: '500px'
            }
          };
    
// Rédupération du texte titre venant de l input
    const handleTxtTitle =(e:ChangeEvent<HTMLInputElement>) => {
        dispatch(titleParagraphWay({titleParagraphWay:e.target.value}))
    };
// envoie du nouveau chemin dans le state de redux 
    const sendNewWay = () => {
        const newWayParagraph = {
            titleParagraphWay :titleParagraph,
            idParagraph : [],
            idPreviousWay:null ,
            idNextWay :null,
            choiceNewWay:null,
            idNovel : dataWayParagraph.novelUsed,
            beginWay:false
        };
// action de de la sauvegarde dans redux
      dispatch(saveWayParagraph())
    };

    const addNewSelectParagraph = () => {
        dispatch(addNewParagraphInWay())
    };

    const addNewSelectChoice = () => {
        const newSelectedInputChoiceWay ={
            stateOptions : {
                idSelect:0, 
                idOptionSelect:0, 
                idParagraphWaySelect:0,
                txtQuestionNewWay:""
            }
        }
        dispatch(addNewChoiceInWay())
    };
//  affichage du component select input pour le choix des paragraph dans le chemin
    const createSelectParagraphs = () => {
        return (
            dataWayParagraph.selectedInputParagraphWay.map((selectedParagraph, index)=>{
              
                return (
                    <>
                        <SelectParagraphWay key={index+'_keySelect'} data={{ 
                                                    idSelect:index,
                                                    idParagraphSelect:selectedParagraph.idParagraphSelect, 
                                                    idOptionSelect:selectedParagraph.idOptionSelect
                                                }}/>
                    </>
                )
            })
        )
   
    };

    function newWay () {
        dispatch(createChoiceWay())
    };

    
 
    useEffect(()=> {
        dataWayParagraph.selectedParagraphWay.choiceNewWay ? setTxtBtnNewWay('Supprimer les nouveaux chemins') : setTxtBtnNewWay('Créer des nouveaux chemins')
 
    }, [dataWayParagraph.selectedParagraphWay.choiceNewWay])

    return(
        <>
        <Modal
        isOpen={dataWayParagraph.modalNewWayParagraph.open}
        // style={customStyles}
        className={styleModalWayPara.modal}
        contentLabel="Example Modal">
            <div className={styleModalWayPara.containModalWayParagraph}>
                <div className={styleModalWayPara.modalTitleWayPagraph}>
                   <label> Titre chemin de parapgrahe</label> 
                    <input type='text'name='titleWayParagraph' onChange={e=>handleTxtTitle(e)} value={dataWayParagraph.selectedParagraphWay.titleParagraphWay}/>
                </div>
                <label> Paragraphe dans le chemin</label> 
                <div className={styleModalWayPara.modalContainSelectWayParagraph}>
                    {dataWayParagraph.selectedInputParagraphWay? createSelectParagraphs(): null}
                    <input className={sytleBouton.boutonAdd} type="button" value="Ajouter un paragraphe" onClick={addNewSelectParagraph}/>
                    
                </div>
                <div className = {styleModalWayPara.modalContainChoiceWay}>
                <input className={sytleBouton.boutonAdd} type="button" value={txtBtnNewWay} onClick={newWay}/>
                    {dataWayParagraph.selectedParagraphWay.choiceNewWay? <ZoneChoiceWay/> : null }
                    
                </div>
            
                <input className={sytleBouton.boutonAdd} type="button" value="Sauvegarder" onClick={sendNewWay}/>
                <input className={sytleBouton.boutonAdd} type="button" value="Fermer" onClick={()=>dispatch(opcModalNewWayParagraph({open:false, startWay:false}))}/>
            </div>

        </Modal> 
</>
    )
}

export default ModalNewWay
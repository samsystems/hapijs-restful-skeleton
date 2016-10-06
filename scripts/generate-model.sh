#!/usr/bin/env bash
allattr=''

function run {
  echo "sequelize model:create --name $model --attributes $allattr --config ${CONFIG} --models-path ${MODELS_PATH} --migrations-path ${MIGRATIONS_PATH}"
  sequelize model:create --name $model --attributes $allattr --config ${CONFIG} --models-path ${MODELS_PATH} --migrations-path ${MIGRATIONS_PATH}
}

function addType(){
  if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
    allattr="$allattr, $1:$2"
  fi
  if [[ -z $allattr ]]; then #-z Longitud igual a 0 o vacío
    allattr="$1:$2"
  fi
  addAttr
}

function typos() {
  echo "Select attr type:"
  select yn in "string" "text"; do
    case $yn in
        string ) addType $1 "string"; break;;
        text ) addType $1 "text"; break;;
    esac
  done
}

function addAttr {
  attr=''
  petexit=''

  if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
    petexit="(Press enter to generate)"
  fi

  read -p "Enter name for attribute$petexit:" attr

  if [[ -z $attr ]]; then
    if [[ -n $allattr ]]; then #-n Con longitud mayor que 0
      echo "Generating model"
      run
    fi
    if [[ -z $allattr ]]; then #-z Longitud igual a 0 o vacío
      exit;
    fi
  fi

  if [[ -n $attr ]]; then
    typos $attr
  fi
}

function pressToExit {
  echo "Do you want exit:"
  select yn in "Yes" "No"; do
    case $yn in
        Yes ) exit; break;;
        No ) modelName;;
    esac
  done
}

function modelName {
  read -p "Enter name for model:" model

  if [[ -z $model ]]; then
    pressToExit
  fi
  if [[ -n $model ]]; then
    addAttr
  fi
}
modelName


#!/bin/sh
//TODO: Example Script


#Display versions (for debuging)
echo $PATH
echo 'NODE_ENV: ' $NODE_ENV
node --version
npm --version
gulp --version

#Chama npm install com a variável NODE_ENV do ambiente atual.
npm install

#Roda testes unitários.
#TODO: por enquanto, não existem.
#./node_modules/karma/bin/karma start karma.conf.jenkins.js



#copia os arquivos para diretorio de deploy
cp -r . /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/
rm /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/jenkins-make-producao.sh
rm /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/kd-backend.conf

#cria diretorio vazio para log.
mkdir /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/log
chmod 775 /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/log
#cria link para upload de arquivos (independe da versao).
ln -s /opt/kdbackend/upload /mnt/kddeploysprod/backend/kd-v$BUILD_NUMBER/upload



#Para o serviço do KD
echo 'Parando servico'
#sudo service kd-backend stop

#estes passos sao feitos
echo 'Reapontando link'
echo 'acerta permissoes'
#ln -sfT /opt/kdbackend/kd-v001/ /mnt/kddeploysprod/backend/kd-backend




#reinicia servico
#sudo service kd-backend start

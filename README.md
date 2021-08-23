# Projeto para consultar boleto por linha digitável

### Passos:
1. Na raiz do projeto, copie e cole o arquivo `.env-example` sem o `-example`, ou se preferir, execute o comando abairo no **bash**:
    ```shell
    cp .env-example .env
    ```

2. Certifique-se de está executando a versão do [Node.js](https://nodejs.org/pt-br/) a partir da `14.x LTS`:
    ```shell
    node -v
    ```

3. Instale os pacotes de dependência do projeto via [NPM](https://www.npmjs.com/), geramente o mesmo é instalando com o [Node.js](https://nodejs.org/pt-br/):
    ```shell
    npm install
    ```

### Executando o projeto:
> Seguido os passos acima, existem duas formas de executar o projeto, em modo de desenvolvimento e simulando produçao.
>
> Ambos, tanto desenvovimento quando simulando produção, estarão executando em: [http://localhost:8080](http://localhost:8080), a porta pode ser alterada no arquivo `.env`. Lembre-se que, ao alterar a porta no `.env`, é necessário reiniciar o projeto.

1. Modo de desenvolvimento:
    ```shell
    npm run dev
    ```

2. Modo de simulação de produção:
    ```shell
    npm run build && npm run start
    ```

### Acessando o projeto:
> Conforme já descrito no passo anterior, o projeto estará executando em [http://localhost:8080](http://localhost:8080).

Esse projeto contém uma única rota do tipo GET [http://localhost:8080/boleto/:codigo](http://localhost:8080/boleto/:codigo) e essa rota só aceita a linha digitável do boleto no lugar do `:codigo`

#### Exemplo de requisição: [http://localhost:8080/boleto/21290001192110001210904475617405975870000002000](http://localhost:8080/boleto/21290001192110001210904475617405975870000002000)

#### Exemplo de retorno com sucesso:
```json
// status 200
{
  "barCode": "21299758700000020000001121100012100447561740",
  "amount": "20.00",
  "expirationDate": "2018-07-17"
}
```

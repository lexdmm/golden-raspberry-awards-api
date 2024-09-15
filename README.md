# golden-raspberry-awards-api

Desenvolva uma API RESTful para possibilitar a leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

Requisito do sistema:
1. Ler o arquivo CSV abaixo. Ele tem a lista dos filmes com seus dados que devem ser e inseridos em uma base de dados ao iniciar a
aplicação (Pasta *src/shared/movielist.csv*).

Requisitos da API:
1. Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido, seguindo a especificação de formato exemplo definido abaixo;
```
{
   "min":[
      {
         "producer":"Producer 1",
         "interval":1,
         "previousWin":2008,
         "followingWin":2009
      },
      {
         "producer":"Producer 2",
         "interval":1,
         "previousWin":2018,
         "followingWin":2019
      }
   ],
   "max":[
      {
         "producer":"Producer 1",
         "interval":99,
         "previousWin":1900,
         "followingWin":1999
      },
      {
         "producer":"Producer 2",
         "interval":99,
         "previousWin":2000,
         "followingWin":2099
      }
   ]
}
```

## Requisitos não funcionais do sistema:
1. O web service RESTful deve ser implementado com base no nível 2 de maturidade de Richardson;
2. Devem ser implementados somente testes de integração. Eles devem garantir que os dados obtidos estão de acordo com os dados fornecidos na proposta;
3. O banco de dados deve estar em memória utilizando um SGBD embarcado (sqlite3). Nenhuma instalação externa deve ser necessária;
4. Como serão testados conjuntos de dados com cenários diferentes, é importante garantir a precisão dos resultados independente dos dados de entrada.

## Estrutura de diretorios
```arduino
src/
│
├── awards/
│   ├── awards.controller.ts
│   ├── awards.module.ts
│   ├── awards.service.ts
│   ├── entities/
│   │   └── movie.entity.ts
│   └── tests/
│       ├── mocks/
│           └── repository.mock
│       └── awards.integration.spec.ts
        └── awards.service.spec.ts
└── shared/
    └── movielist.csv
```

## Como rodar
Para rodar o projeto: 
```
docker-compose up -d
```

Em seguida basta subir no swagger para testar os serviços do endpoint awards em:
[http://localhost:3000/api](http://localhost:3000/api)

Para parar o projeto destruir os containers:
```
docker-compose down
```

### Executar os Testes
Para rodar os testes: 
```
yarn test
```

Para rodar os testes com cobertura de código: 
```
yarn test:cov
```

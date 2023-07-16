from flask import Flask, jsonify
from faker import Faker
import random


app = Flask(__name__)
fake = Faker('pt_BR')
fake.use_english = False

dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com']

@app.route('/api/pessoas/<int:num_pessoas>', methods=['GET'])
def obter_pessoas(num_pessoas):
    pessoas = []

    for _ in range(num_pessoas):
        nome = fake.name()
        data_nascimento = fake.date_of_birth().strftime('%d/%m/%Y')
        email = fake.user_name() + '@' + random.choice(dominios)
        salario = round(random.uniform(1000, 10000), 2)
        pessoa = {
            'nome': nome,
            'data_nascimento': data_nascimento,
            'email': email,
            'salario': salario
        }
        pessoas.append(pessoa)

    return jsonify(pessoas), 200

if __name__ == '__main__':
    app.run()

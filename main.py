from flask import Flask, jsonify, send_from_directory
from faker import Faker
import random
import os

app = Flask(__name__)
fake = Faker('pt_BR')

dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com']

MAX_PESSOAS = 1000


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/ios-frame.jsx')
def ios_frame():
    return send_from_directory('static', 'ios-frame.jsx', mimetype='text/javascript')


@app.route('/app/<path:filename>')
def app_files(filename):
    return send_from_directory('static/app', filename, mimetype='text/javascript')


@app.route('/assets/<path:filename>')
def asset_files(filename):
    return send_from_directory('static/assets', filename)


@app.route('/api/pessoas/<int:num_pessoas>', methods=['GET'])
def obter_pessoas(num_pessoas):
    if not (1 <= num_pessoas <= MAX_PESSOAS):
        return jsonify({'erro': f'num_pessoas deve estar entre 1 e {MAX_PESSOAS}'}), 400

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


@app.errorhandler(404)
def nao_encontrado(e):
    return jsonify({'erro': 'Rota não encontrada'}), 404


@app.errorhandler(405)
def metodo_nao_permitido(e):
    return jsonify({'erro': 'Método não permitido'}), 405


@app.errorhandler(500)
def erro_interno(e):
    return jsonify({'erro': 'Erro interno do servidor'}), 500


if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', '5000'))
    app.run(debug=debug, host=host, port=port)

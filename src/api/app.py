from flask import Flask, request, jsonify, render_template, flash
import random
import string
from database import db_session
from models.User import User
from models.Account import Account
from models.Transaction import Transaction
from flask_login import LoginManager, UserMixin, login_user, logout_user
from flask_wtf.csrf import CSRFProtect
from flask_cors import CORS



app = Flask(__name__, template_folder='../views', static_folder='../views/static')
login_manager = LoginManager()
app.secret_key = "2la"
login_manager.init_app(app)
csrf = CSRFProtect(app)
CORS(app)
 

from database import init_db
init_db()

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
@login_manager.user_loader
def loader_user(user_id):
    return User.query.get(user_id)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/register")
def register():
    return render_template('register.html')

@csrf.exempt
@app.route('/users/create/', methods=['POST'])
def create():
    users = User.query.all()
    for user in users:
        if (user.email == request.json.get('email')):
            return jsonify('false')
        
    user = User(name=request.json.get('name'), email=request.json.get('email'), password=request.json.get('password'))
    db_session.add(user)
    db_session.commit()
    print(user)

    return jsonify('true')

@app.route("/accueil", methods=['GET'])
def accueil():

    return render_template('accueil.html')

@app.route('/users/list/', methods=['GET'])
def get_users():
    users = User.query.all()

    return {
        'data': [{
            "id": user.id,
            "username": user.name,
            "email": user.email,
        } for user in users]
    }

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    return jsonify(name=user.name, email=user.email, password=user.password), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)

    data = request.form
    if 'name' in data :
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.email = data['password']


    db_session.commit()

    return jsonify(name=user.name, email=user.email, password=user.password), 200

    
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)

    db_session.delete(user)
    db_session.commit()

    return jsonify({"message": "reussi"}), 200


@csrf.exempt
@app.route('/account/create/', methods=['POST'])
def create_account():
    account = Account(
        label=request.json.get('label'),
        amount=request.json.get('amount'),
        type=request.json.get('type'),
        threshold=request.json.get('threshold'),
        user_id=request.json.get('user_id')
    )
    db_session.add(account)
    db_session.commit()
    
    return jsonify(id=account.id ,label=account.label,amount=account.amount,type=account.type,threshold=account.threshold, user_id=account.user_id), 200

@app.route('/account/list/', methods=['GET'])
def get_accounts():
    accounts = Account.query.all()

    return {
        'data': [{
            "id":account.id,
            "label":account.label,
            "amount":account.amount,
            "type":account.type,
            "threshold":account.threshold, 
            "user_id":account.user_id
        } for account in accounts]
    }

@app.route('/account/<int:account_id>', methods=['GET'])
def get_account(account_id):
    account=Account.query.get(account_id)

    return jsonify(label=account.label,amount=account.amount,type=account.type,threshold=account.threshold, user_id=account.user_id), 200

@app.route('/account/<int:account_id>', methods=['PUT'])
def update_account(account_id):
    account = Account.query.get(account_id)

    data = request.form
    if 'label' in data :
        account.label = data['label']
    if 'amount' in data:
        account.email = data['amount']
    if 'type' in data:
        account.type = data['type']
    if 'threshold' in data:
         account.threshold= data['threshold']

    db_session.commit()

    return jsonify(label=account.label,amount=account.amount,type=account.type,threshold=account.threshold, user_id=account.user_id), 200

@csrf.exempt
@app.route('/account/<int:account_id>', methods=['DELETE'])
def delete_account(account_id):
    account = Account.query.get(account_id)

    db_session.delete(account)
    db_session.commit()

    return jsonify({"message": "reussi"}), 200



@app.route('/account/<int:user_id>/user', methods=['GET'])
def get_accounts_by_user_id(user_id):
    accounts = Account.query.filter_by(user_id=user_id).all()

    return {
        'data': [{
            "id":account.id,
            "label":account.label,
            "amount":account.amount,
            "type":account.type,
            "threshold":account.threshold, 
            "user_id":account.user_id
        } for account in accounts]
    }

@csrf.exempt
@app.route('/transactions/create/', methods=['POST'])
def create_transaction():
    account = Account.query.get(int(request.json.get('account_id')))
    amountConv = 0
    if (request.json.get('type') == 'retrait'):
        amountConv = amountConv - float(request.json.get('amount'))
    else:
        amountConv = amountConv + float(request.json.get('amount'))
        
    transaction = Transaction(
            reference=''.join(random.choice(string.ascii_lowercase) for i in range(8)),
            type=request.json.get('type'),
            amount=float(request.json.get('amount')), 
            balance=account.amount + amountConv,
            account_id=int(request.json.get('account_id'))
        )
    account.amount = transaction.balance
    db_session.add(transaction)
    db_session.commit()

    return jsonify(reference=transaction.reference, amount=transaction.amount, balance=transaction.balance, account_id=transaction.account_id,created_at=transaction.created_at,update_at=transaction.updated_at), 200

@app.route('/transactions/list/', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()

    return {
        'data': [{
            "id": trans.id,
            "reference": trans.reference,
            "amount": trans.amount,
            "date": trans.date,
            "balance": trans.balance,
            "account_id":trans.account_id,
            "created_at":trans.created_at,
            "update_at":trans.updated_at,

        } for trans in transactions]
    }

@app.route('/transactions/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)

    return jsonify(reference=transaction.reference, date=transaction.date,amount=transaction.amount, balance=transaction.balance, account_id=transaction.account_id,created_at=transaction.created_at,update_at=transaction.updated_at), 200

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)

    data = request.form
    if 'reference' in data :
        transaction.reference = data['reference']
    if 'amount' in data:
        transaction.amount = data['amount']
    if 'balance' in data:
        transaction.balance= data['balance']


    db_session.commit()

    return jsonify(reference=transaction.reference, amount=transaction.amount, balance=transaction.balance, account_id=transaction.account_id,created_at=transaction.created_at,update_at=transaction.updated_at), 200

    
@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transactions(transaction_id):
    transaction = Transaction.query.get(transaction_id)

    db_session.delete(transaction)
    db_session.commit()

    return jsonify({"message": "reussi"}), 200

@app.route('/transactions/account/<int:account_id>/', methods=['GET'])
def get_transaction_by_account_id(account_id):
    transactions = Transaction.query.filter_by(account_id=account_id).all()

    data = [{
            "id": trans.id,
            "reference": trans.reference,
            "amount": trans.amount,
            "account": (Account.query.get(trans.account_id)).label,
            "type": trans.type,
            "balance": trans.balance,
            "account_id": trans.account_id,
            "created_at": trans.created_at,
            "update_at": trans.updated_at
        } for trans in transactions]
    
    print(data)

    return render_template('transaction.html', transactions=data)

@app.route("/login", methods=["GET", "POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:
        login_user(user)
        return jsonify("true")
    else:
        return jsonify("false")

@app.route("/logout", methods=['GET'])
def logout():
    logout_user()
    return render_template('index.html')

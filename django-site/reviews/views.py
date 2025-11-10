from django.shortcuts import render, redirect
from django.conf import settings
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
import requests

API_BASE = getattr(settings, "EXPRESS_API", "http://127.0.0.1:5000")

def _normalize_dealer(d):
    """Ensure dealer dict has 'id' (string) for templates."""
    if not d:
        return d
    # if _id exists (from fallback or Mongo), copy to id
    if isinstance(d, dict):
        if '_id' in d:
            d['id'] = str(d['_id'])
        elif 'id' not in d:
            # maybe already has id or use name hash fallback
            d['id'] = d.get('name','dealer').replace(' ','_')
    return d

def home(request):
    state = request.GET.get('state')
    try:
        if state:
            r = requests.get(f"{API_BASE}/dealers/state/{state}")
        else:
            r = requests.get(f"{API_BASE}/dealers")
        dealers = r.json() if r.ok else []
    except Exception:
        dealers = []
    # normalize dealers list
    dealers = [_normalize_dealer(d) for d in dealers]
    return render(request, 'home.html', {'dealers': dealers})

def dealer_detail(request, dealer_id):
    try:
        d = requests.get(f"{API_BASE}/dealers/{dealer_id}").json()
        reviews = requests.get(f"{API_BASE}/dealers/{dealer_id}/reviews").json()
    except Exception:
        d = {}
        reviews = []
    d = _normalize_dealer(d)
    return render(request, 'dealer_detail.html', {'dealer': d, 'reviews': reviews})

def about(request):
    return render(request, 'about.html')

def contact(request):
    return render(request, 'contact.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        pwd = request.POST.get('password')
        if username and pwd:
            user = User.objects.create_user(username=username, password=pwd)
            login(request, user)
            return redirect('home')
    return render(request, 'signup.html')

@login_required
def add_review(request, dealer_id):
    if request.method == 'POST':
        payload = {
            'user': request.user.username,
            'rating': request.POST.get('rating'),
            'review': request.POST.get('review')
        }
        try:
            requests.post(f"{API_BASE}/dealers/{dealer_id}/reviews", json=payload)
        except Exception:
            pass
        return redirect('dealer_detail', dealer_id=dealer_id)
    # GET:
    try:
        dealer = requests.get(f"{API_BASE}/dealers/{dealer_id}").json()
    except Exception:
        dealer = {}
    dealer = _normalize_dealer(dealer)
    return render(request, 'add_review.html', {'dealer': dealer})

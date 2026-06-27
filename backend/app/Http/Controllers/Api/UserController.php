<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(protected UserRepository $repository) {}

    public function index(Request $request)
    {
        $data = $this->repository->paginate(
            $request->integer('per_page', 15),
            ['roles'],
            $request->only('search'),
        );

        return UserResource::collection($data);
    }

    public function store(UserRequest $request)
    {
        $user = $this->repository->create($request->safe()->except('roles'));
        $user->syncRoles($request->input('roles', []));

        return new UserResource($user->load('roles'));
    }

    public function show(int $id)
    {
        return new UserResource($this->repository->findOrFail($id, ['roles', 'etudiant']));
    }

    public function update(UserRequest $request, int $id)
    {
        $data = $request->safe()->except(['roles', 'password']);
        if ($request->filled('password')) {
            $data['password'] = $request->validated('password');
        }
        $user = $this->repository->update($id, $data);

        if ($request->has('roles')) {
            $user->syncRoles($request->input('roles', []));
        }

        return new UserResource($user->load('roles'));
    }

    public function destroy(int $id)
    {
        $this->repository->delete($id);

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    /** Liste des rôles disponibles (pour les formulaires admin). */
    public function roles()
    {
        return response()->json(['data' => Role::pluck('name')]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(protected NotificationService $service) {}

    /** Notifications de l'utilisateur connecté. */
    public function index(Request $request)
    {
        return NotificationResource::collection(
            $this->service->pourUtilisateur($request->user()->id),
        );
    }

    public function marquerLu(int $id)
    {
        return new NotificationResource($this->service->marquerLu($id));
    }

    public function marquerToutLu(Request $request)
    {
        $count = $this->service->marquerToutLu($request->user()->id);

        return response()->json(['message' => "{$count} notification(s) marquée(s) comme lue(s)."]);
    }
}
